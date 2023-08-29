<?php

namespace App\Services;
use Aws\S3\S3Client;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class CreateMinioUser {

    private $aws_access_key_id;
    private $aws_secret_access_key;
    private $aws_default_region;
    private $aws_bucket_name;
    private $aws_endpoint;

    private $client;
    private $api_endpoint;

    public function __construct() {
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

        // on crée l'utilisateur
        $this->create();
    }

    // Create Access Keys for a User connected with aws_access_key_id and aws_secret_access_key
    public function create()
    {

        // $process = new Process(['/root/minio-binaries/mc', 'admin', 'info', 'myminio']);

        $process = new Process(['/root/minio-binaries/mc', 'alias', 'set', "myminio", "http://minio:9000", $this->aws_access_key_id, $this->aws_secret_access_key]);
        $process->run();

        // dd all errors and output
        // dd($process->getErrorOutput());

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        // dd($process->getOutput());

        $process = new Process(['/root/minio-binaries/mc', 'admin', 'info', 'myminio']);

        $process->run();


        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        dd($process->getOutput());

    }


}
