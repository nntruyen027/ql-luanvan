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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('room_id');
            $table->unsignedBigInteger('thesis_id');

            $table->date('date'); // ngày bảo vệ
            $table->time('start_time'); // giờ bắt đầu (24h)
            $table->time('end_time');   // giờ kết thúc

            $table->enum('session', ['sáng', 'chiều', 'tối'])->nullable();

            $table->timestamps();

            // Khóa ngoại
            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
            $table->foreign('thesis_id')->references('id')->on('theses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedules');
    }
};
