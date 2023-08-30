<?php

namespace App\Services;
use Aws\S3\S3Client;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Support\Str;

class CreateMinioUser {

    private $aws_access_key_id;
    private $aws_secret_access_key;
    private $aws_default_region;
    private $aws_bucket_name;
    private $aws_endpoint;

    private $client;
    private $api_endpoint;

    public function __construct() {

        echo(env('AWS_ACCESS_KEY_ID'));
        echo(env('AWS_SECRET_ACCESS_KEY'));
        echo(env('AWS_DEFAULT_REGION'));
        echo(env('AWS_BUCKET'));

        $this->aws_access_key_id = env('AWS_ACCESS_KEY_ID');
        $this->aws_secret_access_key = env('AWS_SECRET_ACCESS_KEY');
        $this->aws_default_region = env('AWS_DEFAULT_REGION');
        $this->aws_bucket_name = env('AWS_BUCKET');


        // on instancie le client Minio à travers le sdk AWS car tout est compatible
        $this->client = new S3Client([
            'version' => 'latest',
            'region' => $this->aws_default_region,
            'endpoint' => $this->aws_endpoint,
            'use_path_style_endpoint' => true,
            'credentials' => [
                'key' => $this->aws_access_key_id,
                'secret' => $this->aws_secret_access_key,
            ],
        ]);

    }

    // Create Access Keys for a User connected with aws_access_key_id and aws_secret_access_key
    public function create(){


        $process = new Process(['/root/minio-binaries/mc', 'alias', 'set', "myminio", "http://minio:9000", $this->aws_access_key_id, $this->aws_secret_access_key]);
        $process->run();


        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $accesskey = Str::random(20);
        $secretkey = Str::random(20);

        $process = new Process(['/root/minio-binaries/mc', 'admin', 'user','svcacct' ,'add', '--access-key', $accesskey, '--secret-key', $secretkey, 'myminio', $this->aws_access_key_id]);

        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        return [
            'accesskey' => $accesskey,
            'secretkey' => $secretkey
        ];

    }

}
