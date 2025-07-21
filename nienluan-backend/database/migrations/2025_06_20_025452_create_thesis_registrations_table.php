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
        Schema::create('thesis_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('thesis_id')->constrained()->onDelete('cascade'); // Liên kết đề tài gốc
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // Trạng thái đăng ký
            $table->text('reject_note')->nullable(); // Lý do từ chối
            $table->timestamps();
        });

        // Pivot table: thesis_registration_student (mỗi đăng ký có thể nhiều sinh viên)
        Schema::create('thesis_registration_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('thesis_registration_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade'); // giả sử sinh viên nằm trong bảng `users`
            $table->timestamps();

            $table->unique(['thesis_registration_id', 'student_id'], 'trs_student_unique'); // Tránh đăng ký trùng
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('thesis_registrations');
    }
};
