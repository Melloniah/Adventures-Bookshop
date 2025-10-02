import Head from 'next/head';
import Layout from '../layout';
import CheckoutForm from '../../components/Cart/CheckOutForm'

export default function CheckoutPage() {
  return (
    <>
      <Head>
        <title>Checkout - Adventures Bookshop</title>
        <meta name="description" content="Complete your order securely with M-Pesa or Via WhatsApp" />
      </Head>

      <Layout>
        <div className="py-8">
          <CheckoutForm />
        </div>
      </Layout>
    </>
  );
}