import Head from 'next/head';
import Layout from './layout';
import CheckoutForm from '../components/CheckoutForm';

export default function CheckoutPage() {
  return (
    <>
      <Head>
        <title>Checkout - SchoolMall</title>
        <meta name="description" content="Complete your order securely with M-Pesa or WhatsApp" />
      </Head>

      <Layout>
        <div className="py-8">
          <CheckoutForm />
        </div>
      </Layout>
    </>
  );
}