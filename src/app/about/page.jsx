export const metadata = {
  title: 'About Us | SM Drips',
  description:
    'SM Drips is a Pakistani streetwear brand built for those who refuse to blend in. Premium cuts, deliberate design, made right.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#E9E9E9]">
      <h1 className="text-4xl lg:text-5xl font-normal text-center text-[#E9E9E9] mb-16 pt-24">
        About Us
      </h1>
      <div className="max-w-[80%] mx-auto px-6 pb-24">

        <p className="text-sm lg:text-base text-[#aaa] leading-[1.9] mb-8">
          SM Drips is a streetwear brand built for those who refuse to blend in. We design for the fashion-forward, the bold, and the unapologetically expressive. To wear SM Drips is to move with intention — sharp, minimal, and always ahead. Every piece is conceived with the streets of Pakistan in mind and crafted to stand the test of daily wear.
        </p>

        <p className="text-sm lg:text-base text-[#aaa] leading-[1.9] mb-8">
          SM Drips started with one belief: premium streetwear shouldn't be imported. We spent countless hours obsessing over cuts, fabrics, and finishes to build a product that looks expensive because it is made right. Every drop is the result of deliberate design decisions — nothing accidental, nothing rushed.
        </p>

        <p className="text-sm lg:text-base text-[#aaa] leading-[1.9] mb-8">
          We never compromise on quality or comfort. Because the best outfit is the one you forget you're wearing.
        </p>
      </div>
    </main>
  )
}
