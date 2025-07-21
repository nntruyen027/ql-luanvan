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
        Schema::create('thesis_tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('thesis_id');
            $table->string('title'); // Tên công việc
            $table->text('description')->nullable(); // Mô tả
            $table->date('deadline'); // Hạn chót

            // Trạng thái công việc
            $table->enum('status', [
                'notstarted',
                'doing',
                'finished',
                'cancelled'
            ])->default('notstarted');

            // Trạng thái đánh giá & ghi chú của giảng viên
            $table->enum('instructor_status', [
                'passed',
                'failed'
            ])->nullable();

            $table->text('instructor_note')->nullable();

            $table->timestamps();

            // Liên kết với bảng thesis nếu cần
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
        Schema::dropIfExists('thesis_tasks');
    }
};
