export const metadata = {
  title: 'Shipping Policy | SM Drips',
  description:
    'Learn about SM Drips shipping charges, delivery timeframes, COD policy, and how we handle damaged or incorrect orders across Pakistan.',
}

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#E9E9E9]">
      <h1 className="text-4xl font-normal text-center text-[#E9E9E9] mb-10 pt-24">Shipping Policy</h1>
      <div className="pl-6 lg:pl-16 pr-6 pb-24 max-w-[800px]">
        
        <p className="text-sm text-[#aaa] leading-[1.9] mb-12">
          At SM Drips, we work to get your order to you as fast and safely as possible. Please read this policy carefully before placing your order.
        </p>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Order Processing Time</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              All orders are processed within 1–2 business days after confirmation.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Orders are not processed or dispatched on Sundays or public holidays.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              COD orders are confirmed via WhatsApp before dispatch. If we are unable to reach you within 24 hours, the order may be cancelled.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Shipping Charges</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Free shipping on all orders above PKR 3,999.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              A standard shipping fee applies to orders below PKR 3,999 and is calculated at checkout.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              For returns or exchanges, customers are responsible for Rs. 350/- in courier charges, unless the item received was defective or incorrect.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Delivery Timeframe</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Nationwide delivery within Pakistan: 2–4 working days after dispatch.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Please allow extra time during sales, holidays, or high-demand periods.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Shipping Confirmation &amp; Tracking</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Once your order is dispatched, a confirmation will be sent via WhatsApp along with your tracking number.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Tracking details become active within 24 hours of dispatch.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Delivery Delays</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Delays may occur due to courier issues, public holidays, or unforeseen circumstances.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              SM Drips is not responsible for delays caused by the courier, but we will assist you in tracking and resolving the issue.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Incorrect Address or Failed Delivery</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Please ensure all shipping details are accurate when placing your order.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              SM Drips is not responsible for orders lost or undelivered due to an incorrect address provided by the customer.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Damaged or Defective Items</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              If your order arrives damaged, defective, or incorrect, contact us within 7 days of delivery via WhatsApp or email.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Send photographic evidence of the issue.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              If the claim is approved, we will send a replacement and courier charges will be reimbursed.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Important Notes</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              No returns or exchanges on sale items or special deals.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Shipping and handling charges are non-refundable unless the product was delivered defective or incorrect.
            </li>
          </ul>
        </section>

        <section className="mb-0">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Need Help?</h2>
          <p className="text-sm text-[#aaa] leading-[1.9]">
            Contact our support team on WhatsApp or at <a href="mailto:contact@smdrips.com" className="text-[#defc3e] hover:underline">contact@smdrips.com</a>.
          </p>
          <a
            href="https://wa.me/923190328248"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-[#defc3e] text-[#000000] text-xs font-semibold px-4 py-2.5 tracking-wide rounded-md hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(222,252,62,0.5)] transition-all duration-300"
          >
            Chat on WhatsApp
          </a>
        </section>
      </div>
    </main>
  )
}
