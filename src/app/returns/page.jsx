export const metadata = {
  title: 'Return & Exchange Policy | SM Drips',
  description:
    'Read the SM Drips return and exchange policy. 7-day return window, size exchange rules, refund process, and how to raise a claim.',
}

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#E9E9E9]">
      <h1 className="text-4xl font-normal text-center text-[#E9E9E9] mb-10 pt-24">Return & Exchange Policy</h1>
      <div className="pl-6 lg:pl-16 pr-6 pb-24 max-w-[800px]">

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">What is your return and exchange policy?</h2>
          <p className="text-sm text-[#aaa] leading-[1.9] mb-3">
            You have 7 days from the date of delivery to request a return or exchange if:
          </p>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              The item received is faulty, damaged, or defective.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              The product is unused, in its original packaging, with all labels and tags intact.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              The item received is the wrong size or wrong product.
            </li>
          </ul>
          <p className="text-sm text-[#aaa] leading-[1.9] mt-4 mb-3">
            The following are not eligible for returns or exchanges:
          </p>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Clearance sale items and special deals.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              White, neon, and beige/skin-toned items are not eligible for size exchanges.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Shipping and handling charges are non-refundable unless the product was delivered defective or incorrect.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">How do I apply for a return or exchange?</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Contact us within 7 days of delivery via WhatsApp or email at contact@smdrips.com.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              In the event of a defective, damaged, or incorrect item, send photographic evidence within 7 days of delivery.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              If the claim is approved, a replacement will be sent and delivery charges will be reimbursed via bank transfer.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Customers are responsible for courier charges of Rs. 350/- when returning items, unless the fault is on our end.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">When will my return be processed?</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              We aim to process all returns within 5–7 business days of receiving the item.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              During sale periods, allow up to 14 working days for processing.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">What is your size exchange policy?</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              If you are unhappy with the size, contact us within 7 days of delivery via WhatsApp or email.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              The product must be unused and in its original packaging with all labels and tags intact.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              White, neon, and beige/skin-toned items cannot be exchanged for size.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Do you offer refunds?</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Yes, if the product received is damaged or does not match what you ordered due to a packing error.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Shipping and handling charges are not refunded.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Refunds are processed within 7–10 working days.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Sale & Discounted Products</h2>
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Exchanges on sale or discounted products are only accepted if the item received does not match what you ordered.
            </li>
            <li className="text-sm text-[#aaa] leading-[1.9]">
              Exchanges are not accepted if the request is made outside the 7-day window, the product has been used or tampered with.
            </li>
          </ul>
        </section>

        <section className="mb-0">
          <h2 className="text-base font-medium text-[#E9E9E9] mb-4">Need Help?</h2>
          <p className="text-sm text-[#aaa] leading-[1.9]">
            Contact us on WhatsApp or at <a href="mailto:contact@smdrips.com" className="text-[#defc3e] hover:underline">contact@smdrips.com</a> for any questions about returns or exchanges.
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
