import AdminLayout from '../../components/Admin/AdminLayout';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayoutWrapper({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}