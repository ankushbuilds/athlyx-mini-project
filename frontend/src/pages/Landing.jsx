import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SpecularButton from '../components/SpecularButton';

const useTypewriter = (text, speed = 80, delay = 200) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayText('');
    setIsComplete(false);

    const startTyping = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(startTyping);
  }, [text, speed, delay]);

  return { displayText, isComplete };
};

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("public");

  const { displayText: animatedTitle, isComplete } = useTypewriter(
    t("landing.title"),
    80,
    200
  );

  return (
    <div className="landing">
      <div className="landing-content">
        <div className="landing-title">
          <h1>
            {animatedTitle}
           
          </h1>

          {isComplete && (
            <img
              src="/logo.png"
              alt="Athlyx Logo"
              className="landing-logo"
            />
          )}
        </div>

        <p>
          {t("landing.tagline")}
          <br />
          {t("landing.taglineSecondLine")}
        </p>

        <SpecularButton
          size="lg"
          radius={20}
          tint="#ffffff"
          tintOpacity={0.1}
          blur={8}
          textColor="#ffffff"
          lineColor="#ffffff"
          baseColor="#525252"
          intensity={1.5}
          speed={0.4}
          autoAnimate={true}
          followMouse={true}
          onClick={() => navigate('/home')}
        >
          {t("landing.getStarted")}
        </SpecularButton>
      </div>
    </div>
  );
};

export default Landing;