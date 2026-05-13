import { FaInstagram, FaTiktok, FaWhatsapp, FaFacebook } from 'react-icons/fa'
import Link from 'next/link'

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`
    : null

  return (
    <footer className="bg-[#000000] text-[#E9E9E9] px-6 lg:px-16 pt-16 pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-14 border-b border-[#282828]">
        <div>
          <h3 className="font-heading text-3xl tracking-widest text-[#E9E9E9] mb-3">SM DRIPS</h3>
          <p className="text-xs text-[#666] leading-relaxed mb-6 max-w-50">
            Premium streetwear built for everyday wear. Fast dispatch across Pakistan.
          </p>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#defc3e] text-[#000000] text-xs font-semibold px-4 py-2.5 tracking-wide rounded-md hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(222,252,62,0.5)] transition-all duration-300"
            >
              <FaWhatsapp size={15} />
              Chat on WhatsApp
            </a>
          ) : null}
        </div>

        <div>
          <h4 className="text-[10px] tracking-[3px] text-[#555] uppercase mb-5">SHOP</h4>
          <div className="flex flex-col gap-3">
            <Link href="/shop" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              New Arrivals
            </Link>
            <Link href="/products/t-shirts" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              T-Shirts
            </Link>
            <Link href="/products/hoodies" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              Hoodies
            </Link>
            <Link href="/products/bottoms" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              Bottoms
            </Link>
            <Link href="/categories" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              Collections
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[3px] text-[#555] uppercase mb-5">HELP</h4>
          <div className="flex flex-col gap-3">
            <Link href="/about" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              About Us
            </Link>
            <Link href="/returns" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              Returns &amp; Exchange
            </Link>
            <Link href="/shipping" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              Shipping Policy
            </Link>
            <Link href="/privacy-policy" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-[13px] text-[#aaa] hover:text-[#E9E9E9] transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[3px] text-[#555] uppercase mb-5">FOLLOW US</h4>
          <div className="flex gap-3 mb-8">
            <a
              href="https://instagram.com/smdrips"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[#282828] rounded-lg flex items-center justify-center text-[#888] hover:text-[#E9E9E9] hover:border-[#555] transition-colors duration-200"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="https://tiktok.com/@smdrips"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[#282828] rounded-lg flex items-center justify-center text-[#888] hover:text-[#E9E9E9] hover:border-[#555] transition-colors duration-200"
            >
              <FaTiktok size={16} />
            </a>
            <a
              href="https://facebook.com/smdrips"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[#282828] rounded-lg flex items-center justify-center text-[#888] hover:text-[#E9E9E9] hover:border-[#555] transition-colors duration-200"
            >
              <FaFacebook size={16} />
            </a>
          </div>
          <h4 className="text-[10px] tracking-[3px] text-[#555] uppercase mb-5 mt-0">CONTACT</h4>
          <div className="flex flex-col gap-3">
            <a href="mailto:contact@smgarments.shop" className="text-[13px] text-[#defc3e] hover:underline">
              contact@smgarments.shop
            </a>
            {whatsappNumber ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#defc3e] hover:underline"
              >
                0339-6049590
              </a>
            ) : null}
            <p className="text-[13px] text-[#aaa]">Nationwide COD — All over Pakistan</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-5">
        <p className="text-[11px] text-[#444]">© {new Date().getFullYear()} SM Drips. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/privacy-policy" className="text-[11px] text-[#444] hover:text-[#888] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/returns" className="text-[11px] text-[#444] hover:text-[#888] transition-colors">
            Return Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
