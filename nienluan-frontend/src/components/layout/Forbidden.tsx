'use client';

import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import { LockOutlined } from '@ant-design/icons';
import { logout } from '@/lib/auth';

const Forbidden = () => {
  const router = useRouter();

  const officerLogout = async () => {
    await logout();
    router.push('/auth/teacher/login');
  }


  const studentLogout = async () => {
    await logout();
    router.push('/auth/student/login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <Result
        icon={<LockOutlined style={{ fontSize: 60, color: '#faad14' }} />}
        status="403"
        title="403 - Không có quyền truy cập"
        subTitle="Bạn không được phép truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi."
        extra={
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="primary"
                size="large"
                onClick={officerLogout}
              >
                Đăng nhập cán bộ
              </Button>
              <Button
                size="large"
                onClick={studentLogout}
              >
                Đăng nhập sinh viên
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Forbidden;
