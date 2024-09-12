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
      <div className="w-full flex flex-col md:flex-row">
        <Image
          src={"/img/logo_welcome.png"}
          height={0}
          width={0}
          sizes="50%"
          alt="logo_welcome"
          className="w-1/2 h-auto mr-auto ml-auto object-contain"
          priority
        />
        <div className="bg-[#DAFFC0] p-10 flex flex-col justify-center ml-auto mr-auto w-full md:w-1/2">
          <span
            className={`${openSans.className} text-center text-lg mb-4 text-[#49740B]`}
          >
            WELCOME
          </span>
          <span className={`text-5xl ${playfairDisplay.className} mb-4`}>
            Inclusive Events for people with physical and intellectual
            disabilities 18+
          </span>
          <span className={`text-xl text-[#575757] ${openSans.className}`}>
            Where phenomenal people get together for Great Times!
          </span>
          <Link
            href={"/about"}
            className="m-6 bg-[#49740B] text-white text-base text-center block p-4 font-bold hover:bg-lime-600"
          >
            LEARN MORE
          </Link>
        </div>
      </div>
      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full h-[90px] mt-8 mb-8">
        <span>content ad space</span>
      </div>
      <Image
        src={"/img/halloween-event.png"}
        height={0}
        width={0}
        sizes="100%"
        alt="logo_welcome"
        className="w-full h-auto"
        priority
      />
      <span
        className={`text-lg mt-6 text-[#49740B] ${openSans.className} mb-8`}
      >
        SATURDAY, OCTOBER 12TH, 2024
      </span>
      <div className="flex flex-col mb-10 lg:flex-row">
        <div className="w-full flex flex-col lg:w-[70%]">
          <span
            className={`mb-6 text-4xl ${playfairDisplay.className} text-[#49740B]`}
          >
            2024 GREAT VIBE EVENTS (GVE) SPOOKTACULAR COSTUME PARTY
          </span>
          <strong className={`text-2xl text-[#5e5e5e] ${openSans.className}`}>
            DON'T MISS THE HALLOWEEN EVENT OF THE YEAR!
          </strong>
          <p className={`text-2xl text-[#5e5e5e] ${openSans.className}`}>
            🎃&nbsp;
            <strong>
              Join Us for the 2024 Great Vibe Events Spooktacular Halloween
              Costume Party!
            </strong>
            &nbsp;🎃
          </p>
          <span className="text-2xl text-[#5e5e5e]">
            🗓<strong>Date:</strong>Saturday, October 12th
          </span>
          <span className="text-2xl text-[#5e5e5e]">
            🕓 <strong>Time:</strong>4:00 PM - 7:00 PM
          </span>
          <span className="text-2xl text-[#5e5e5e]">
            📍
            <strong>Location:</strong>
            Unity of Fairfax, 2854 Hunter Mill Road, Oakton, VA 22124
          </span>
          <span
            className={`text-2xl mt-8 text-[#5e5e5e] ${openSans.className}`}
          >
            Get ready for a night of spooky fun and fantastic festivities!
          </span>
          <strong className={`text-2xl text-[#5e5e5e] ${openSans.className}`}>
            Here’s what you can look forward to AT THE GVE SPOOKTACULAR:
          </strong>
          <ul
            className={`text-2xl text-[#5e5e5e] list-inside ml-4 ${openSans.className}`}
          >
            <li>
              👻
              <strong>&nbsp;Costume Contest:</strong>Show off your best
              Halloween costume with prizes for the best dressed! Whether you’re
              spooky, funny, or downright creative, we want to see your best
              look.
            </li>
            <li className="mt-8">
              🕺
              <strong>&nbsp;Dance the Night Away:</strong>
              Our DJ will be spinning the hottest tracks, creating an
              irresistible groove that’ll have you moving and shaking.
            </li>
            <li className="mt-8">
              🎤
              <strong>&nbsp;Karaoke Fun:</strong>
              Unleash your inner superstar in our Karaoke Room! Sing your heart
              out to your favorite tunes and enjoy the spotlight.
            </li>
            <li className="mt-8">
              🎨
              <strong>&nbsp;Unleash Your Inner Artist:</strong>
              Step into our Art Room, where creativity knows no bounds. We’ve
              got all the materials you need to become a shining artist. Paint,
              sketch, draw, —express yourself freely!
            </li>
            <li className="mt-8">
              🎮
              <strong>&nbsp;Game On!:</strong>
              Our Game Room is a gamer’s paradise. Dive into a world of
              excitement with hundreds of video and board games. Challenge your
              friends, discover new favorites, and let the games begin!
            </li>
          </ul>
          <span
            className={`text-2xl text-[#5e5e5e] list-inside ml-4 mt-8 ${openSans.className}`}
          >
            🎟
            <strong>&nbsp;Tickets:</strong>
          </span>
          <ul
            className={`text-2xl text-[#5e5e5e] list-inside list-disc ml-4 ${openSans.className}`}
          >
            <li className="ml-4">$45.00 per participant (includes meal)</li>
            <li className="ml-4">
              $55.00 for 1 participant and 1 caretaker/PARENT (includes
              CARETAKER/PARENT meal)
            </li>
            <li className="ml-4">
              $65.00 for 1 participant and 2 caretakers/PARENTS (includes
              CARETAKER/PARENTS meals)
            </li>
            <li className="ml-4">
              $100.00 for 2 participants and 1 caretaker (includes CARETAKER
              meal)
            </li>
            <li className="ml-4">
              $110.00 for 2 participants and 2 caretakers (includes
              CARETAKER/PARENTS meals)
            </li>
          </ul>
          <span
            className={`text-2xl text-[#5e5e5e] list-inside ml-4 mt-8 ${openSans.className}`}
          >
            Mark your calendars, gather your friends and family, and join us for
            a Halloween party you won’t forget. Don’t miss out on this
            spooktacular event! See you there! 🎃👻
          </span>
          <span
            className={`text-2xl text-[#5e5e5e] list-inside ml-4 ${openSans.className}`}
          >
            #HalloweenParty #Spooktacular #GreatVibeEvents #CostumeContest
            #DanceParty #Karaoke #ArtRoom #GameRoom #BingoBonanza
            #UnityOfFairfax #OaktonVA
          </span>
        </div>
        <div className="w-full lg:w-[30%] pr-6 pl-6 h-fit bg-[#DAFFC0] flex flex-col justify-center">
          <span
            className={`pl-8 pr-8 mt-8 block text-4xl text-[#49740B] mb-6 ${playfairDisplay.className}`}
          >
            GVE 2024 SPOOKTACULAR COSTOME PARTY
          </span>
          <Link
            href={"/events/prod_QoE4XMfgZmQF3K"}
            className="mr-6 ml-6 mb-6 bg-[#49740B] text-white text-base block p-4 font-bold hover:bg-lime-600"
          >
            PURCHASE TICKET
          </Link>
        </div>
      </div>
      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full h-[90px] mt-8 mb-8">
        <span>content ad space</span>
      </div>
      <span className={`text-[#49740B] text-lg ${openSans.className} mb-8`}>
        GREAT TIMES AND GREAT PEOPLE CREATE GREAT VIBES!
      </span>
      <div className="w-full h-[500px] flex overflow-auto gap-3">
        {imageUrls.items.map((imageUrl, index) => (
          <Image
            src={imageUrl.url}
            height={0}
            width={0}
            sizes="100%"
            alt="logo_welcome"
            className="w-full h-auto object-contain"
            priority
            key={`galley_image_${index}`}
          />
        ))}
      </div>
      <p className={`${openSans.className} text-lg mt-5`}>
        [mission statement here]
      </p>

      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full h-[90px] mt-8 mb-8">
        <span>content ad space</span>
      </div>
      <QuoteSlider />
      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full h-[90px] mt-8 mb-8">
        <span>content ad space</span>
      </div>
      <span
        className={`${playfairDisplay.className} w-full text-center text-4xl mb-8`}
      >
        Sign up for gve's monthly news letter
      </span>
      <span
        className={`${openSans.className} text-lg text-gray-500 mb-4 w-full text-center`}
      >
        Learn more about our upcoming events, fundraisers, and more!
      </span>
      <NewsletterForm />
      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full h-[90px] mt-8 mb-8">
        <span>content ad space</span>
      </div>
      <ContactForm />
    </>
  )
}
