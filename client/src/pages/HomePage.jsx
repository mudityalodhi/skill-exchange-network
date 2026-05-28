import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import HowItWorks from '../components/home/HowItWorks';
import PopularSkills from '../components/home/PopularSkills';
import TopMentors from '../components/home/TopMentors';
import Testimonials from '../components/home/Testimonials';
import FeaturedArticles from '../components/home/FeaturedArticles';
import CTASection from '../components/home/CTASection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <PopularSkills />
      <TopMentors />
      <Testimonials />
      <FeaturedArticles />
      <CTASection />
    </div>
  );
};

export default HomePage;
