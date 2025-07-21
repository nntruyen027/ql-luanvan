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
        Schema::create('theses', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Tên đề tài luận văn
            $table->text('description')->nullable(); // Mô tả
            $table->foreignId('report_period_id')->constrained()->onDelete('cascade'); // Kỳ báo cáo
            $table->foreignId('lecturer_id')->constrained('users')->onDelete('cascade'); // Giảng viên công bố
            $table->date('start_date')->nullable(); // Ngày bắt đầu công bố
            $table->date('end_date')->nullable(); // Ngày kết thúc công bố
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('theses');
    }
};
