import Image from "next/image"
import Link from "next/link"
import { Playfair_Display, Open_Sans } from "next/font/google"
import QuoteSlider from "@/components/home/QuoteSlider"
import NewsletterForm from "@/components/home/NewsletterForm"
import ContactForm from "@/components/home/ContactForm"
import { getGalleryImageUrls } from "@/actions/server"
const playfairDisplay = Playfair_Display({ subsets: ["latin"] })
const openSans = Open_Sans({ subsets: ["latin"] })
export default async function Home() {
  const imageUrls = await getGalleryImageUrls(9999)
  return (
    <>
      <div className="flex w-full flex-col md:relative md:flex-row">
        <Image
          src={"/img/welcome.png"}
          height={0}
          width={0}
          sizes="(max-width: 767px) 100vw, (min-width: 768px) 100%"
          alt="logo_welcome"
          className="ml-auto mr-auto h-auto w-full object-cover md:w-[533px] md:flex-grow"
          priority
        />
        <div className="ml-auto mr-auto flex w-full flex-col justify-center bg-black p-10 md:w-[360px] md:p-5 lg:w-[388px] lg:p-10">
          <span
            className={`${playfairDisplay.className} mb-4 text-3xl text-[#a6fc28] md:text-4xl xl:text-5xl`}
          >
            Welcome
          </span>
          <span
            className={`text-sm uppercase text-[#4b7d7d] 2xl:text-base ${openSans.className} mb-4`}
          >
            Inclusive Social Events for Adults with Intellectual & physical
            Disabiliies
          </span>
          <span
            className={`text-2xl text-white ${openSans.className} font-bold`}
          >
            Where phenomenal people get together for Great Vibes!
          </span>
          <Link
            href="/events"
            className="group mt-8 flex h-[56px] w-fit cursor-pointer select-none items-center justify-center gap-1 border border-white pb-2 pl-4 pr-4 pt-2 transition-colors delay-[50ms] ease-in-out hover:bg-white"
          >
            <hr className="w-4 group-hover:border-black" />
            <span
              className={`${openSans.className} text-sm font-bold uppercase tracking-[0.214em] text-white group-hover:text-black`}
            >
              event details
            </span>
            <hr className="w-4 group-hover:border-black" />
          </Link>
        </div>
      </div>
      <div className="mb-8 mt-8 box-border h-[90px] w-full border-2 border-yellow-500 bg-black text-white">
        <span>content ad space</span>
      </div>
      <h1 className={`${openSans.className} text-2xl md:text-3xl 2xl:text-4xl`}>
        Great Vibe Events an organization created with Faith
      </h1>
      <div className="mt-8 flex flex-col gap-10 lg:flex-row">
        <div
          className={`flex flex-col text-[18px] ${openSans.className} order-2 text-center lg:order-1`}
        >
          <span className="text-[#5d5d5d]">
            Susan and Jim Boone, along with their sons Jimmy, Andy, and Mark,
            have dedicated their lives to serving individuals with disabilities.
          </span>
          <span className="text-[#5d5d5d]">
            Their commitment stems from the profound love for their daughter and
            sister, Faith, who was born with Down Syndrome and passed away at
            age three from complication with heart disease. Though her time was
            short, Faith's impact on the family was immeasurable. Their journey
            began with volunteering at Best Buddies, where they found joy in
            mentoring and witnessing their buddies' achievements, while also
            gaining invaluable lessons in compassion and determination.
          </span>
          <span className="text-[#5d5d5d]">
            Recognizing a need for social opportunities for adults with
            disabilities, they founded Great Vibes Events. GVE provides a safe
            and vibrant space for adults 18 and older to connect, learn, and
            participate in inclusive activities, honoring Faith's memory by
            fostering a supportive and compassionate community.{" "}
          </span>
        </div>
        <div className="relative order-1 mb-auto ml-auto mr-auto w-full flex-shrink-0 lg:order-2 lg:w-[378px]">
          <Image
            src={"/img/faith.png"}
            height={0}
            width={0}
            sizes="(max-width: 1023px) 100vw, 378px"
            alt="logo_welcome"
            className="mb-8 h-auto w-full object-contain lg:mb-0"
            priority
          />
          <span
            className={`bg-[#f0f0f0] text-sm text-[#4d4d4d] lg:text-base ${openSans.className} inline-block w-full pb-1 pl-2 pr-2 pt-1 text-center`}
          >
            Faith Boone- The driving force behind Great Vibe Events
          </span>
        </div>
      </div>
      <div className="mb-8 mt-8 box-border h-[90px] w-full border-2 border-yellow-500 bg-black text-white">
        <span>content ad space</span>
      </div>
      <span
        className={`text-base text-[#8f6e6e] ${openSans.className} mb-8 uppercase`}
      >
        great times - great people - great vibes!
      </span>
      <div className="flex h-[500px] w-full gap-3 overflow-auto">
        {imageUrls.items.map((imageUrl, index) => (
          <Image
            src={imageUrl.url}
            height={0}
            width={0}
            sizes="(max-width: 768px) 50vw, 50vw"
            alt="logo_welcome"
            className="h-auto w-full object-contain"
            priority
            key={`galley_image_${index}`}
          />
        ))}
      </div>
      <p className={`${openSans.className} mt-5 text-lg`}>
        [mission statement here]
      </p>

      <div className="mb-8 mt-8 box-border h-[90px] w-full border-2 border-yellow-500 bg-black text-white">
        <span>content ad space</span>
      </div>
      <QuoteSlider />
      <div className="mb-8 mt-8 box-border h-[90px] w-full border-2 border-yellow-500 bg-black text-white">
        <span>content ad space</span>
      </div>
      <span
        className={`${playfairDisplay.className} mb-8 w-full text-center text-[28px] uppercase md:text-[30px] xl:text-[32px] 2xl:text-4xl`}
      >
        sign up for the gve newsletter
      </span>
      <span
        className={`${openSans.className} mb-4 w-full text-center text-lg text-gray-500`}
      >
        Find out about our upcoming events, fundraisers, and more!
      </span>
      <NewsletterForm />
      <div className="mb-8 mt-8 box-border h-[90px] w-full border-2 border-yellow-500 bg-black text-white">
        <span>content ad space</span>
      </div>
      <ContactForm />
    </>
  )
}
