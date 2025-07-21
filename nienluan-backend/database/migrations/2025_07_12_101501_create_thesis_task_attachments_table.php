<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('thesis_task_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('thesis_task_id');
            $table->string('file_path');
            $table->string('file_name');
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('thesis_task_id')
                ->references('id')
                ->on('thesis_tasks')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('thesis_task_attachments');
    }
};
