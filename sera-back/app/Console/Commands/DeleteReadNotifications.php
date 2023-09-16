<?php

namespace App\Console\Commands;

use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteReadNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-read-notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete read notifications older than 1 day';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $notifications = Notification::where('is_read', true)
        ->where('is_deleted', false)
        ->where('created_at', '<', Carbon::now()->subDay())
        ->get();

        foreach ($notifications as $notification) {
            $notification->delete();
        }
    }
}
