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
        Schema::create('report_periods', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Tên kỳ báo cáo
            $table->unsignedBigInteger('semester_id'); // Khóa ngoại đến bảng semesters
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(true); // Trạng thái
            $table->timestamps();

            // Thêm ràng buộc khóa ngoại
            $table->foreign('semester_id')->references('id')->on('semesters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('report_periods');
    }
};
