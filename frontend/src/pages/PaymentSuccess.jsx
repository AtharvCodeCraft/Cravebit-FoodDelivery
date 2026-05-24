import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, ShoppingBag } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.order;

  if (!orderData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4 text-[var(--foreground)]">No recent order found</h2>
        <Link to="/menu" className="text-orange-500 font-bold hover:underline">Return to Menu</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-[var(--card)] p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--border)] text-center print:border-none print:shadow-none">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-24 h-24 text-green-500 animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-black text-[var(--foreground)] mb-2">Payment Successful!</h1>
        <p className="text-[var(--muted-foreground)] mb-8">
          Your order has been placed and is now being processed.
        </p>

        <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl p-6 text-left mb-8 border border-dashed border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-4 text-[var(--foreground)] border-b pb-2">Order Receipt</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-[var(--muted-foreground)]">Order ID</p>
              <p className="font-bold text-[var(--foreground)]">#{orderData._id.substring(18)}</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Payment ID</p>
              <p className="font-bold text-[var(--foreground)]">{orderData.paymentId || 'Cash on Delivery'}</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Date</p>
              <p className="font-bold text-[var(--foreground)]">{new Date(orderData.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Payment Method</p>
              <p className="font-bold text-[var(--foreground)]">{orderData.paymentMethod}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {orderData.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-[var(--foreground)]">{item.quantity}x {item.name}</span>
                <span className="font-medium text-[var(--foreground)]">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-bold text-lg text-[var(--foreground)]">Total Amount Paid</span>
            <span className="font-black text-2xl text-orange-600">₹{orderData.totalAmount}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-[var(--muted)] text-[var(--foreground)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--border)] transition-colors"
          >
            <Download className="w-5 h-5" /> Download Receipt
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" /> Track Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
