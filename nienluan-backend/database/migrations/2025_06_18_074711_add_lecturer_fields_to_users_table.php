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
        Schema::table('users', function (Blueprint $table) {
            $table->string('user_code')->nullable()->unique()->after('id'); // Mã cán bộ
            $table->string('phone_number')->nullable()->after('email');         // Số điện thoại
            $table->foreignId('major_id')->nullable()->after('phone_number')->constrained()->onDelete('set null'); // Ngành học
            $table->enum('role', ['admin', 'lecturer', 'student'])->default('student')->after('major_id'); // Vai trò
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
