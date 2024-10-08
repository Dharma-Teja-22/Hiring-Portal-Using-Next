import Head from 'next/head';
import Header from "../header/page"
const about = () => {
  return (
    <div>
      <Head>
        <title>About Us - Miracle</title>
        <meta name="description" content="Learn about Miracle's journey and our approach to innovation." />
      </Head>
      <div className="absolute opacity-30 bg-black h-full w-full"></div>
      <div className="absolute justify-items-center">
        <h1 className="justify-start pl-32 mt-16 pt-8 text-6xl font-normal text-white">
          Who We Are
        </h1>
        <p className="justify-start pl-36 pr-36 text-justify pt-10 font-medium text-white">
          Incorporated in 1994, we have come a long way from our roots. Growing from the days of MRP to ERP transition and the birth of the Internet,
          we are now a leader in the IT world, working with the latest technologies to innovate and help businesses across the globe evolve.
          Headquartered in Novi, Michigan with over 2500 Miraclites across the globe, Miracle is a privately owned, minority-certified firm focussed on helping our customers transform digitally.
          Miracle has a proven record of evolving over the past three decades to fulfil our customer’s technology needs and deliver with the highest quality.
          Our Global Delivery Model, with multiple locations worldwide, allows us to provide our customers with cost-effective, high-quality and innovative solutions and services.
          We are proud to say that we are serving 42 of today’s Fortune 100 and challenge our team members to be innovative with everything that they do.
        </p>
        <h1 className="justify-start pl-32 pt-10 text-6xl font-normal text-white">
          The Miracle Way
        </h1>
        <p className="justify-start pl-36 pr-36 text-justify pt-10 font-medium text-white">
          At Miracle, we believe in an Always-Available, Innovation-First approach that enables us to be a trusted partner for our customers in their transformation journeys.
          We emphasize on putting our customers and employees first, which is at the core of our success as we continue to go above and beyond with game-changing innovations.
        </p>
        <button data={"Learn More"} url={'https://miraclesoft.com/'} />
      </div>
      <Header />
      <img className="h-screen w-screen" src="https://www.forbes.com/advisor/wp-content/uploads/2022/03/Best_Recruiting_Software_-_article_image.jpg" alt="Miracle Background" />
    </div>
  );
};

export default about;
