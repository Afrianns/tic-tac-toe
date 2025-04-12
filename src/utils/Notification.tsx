import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import checklist from "../assets/checklist.svg";

interface propsType {
  setShowNotif: (n: boolean) => void;
}

export default function Notification({ setShowNotif }: propsType) {
  useGSAP(() => {
    gsap.from(".game-notification", {
      x: 210,
      duration: 1,
      ease: "elastic.out",
    });

    setTimeout(() => {
      gsap.to(".game-notification", {
        x: 210,
        duration: 0.5,
        ease: "expo.out",
        onComplete() {
          setShowNotif(false);
        },
      });
    }, 3000);
  });

  return (
    <div className="game-notification">
      <img src={checklist} alt="" />
      <p>GAME SAVED</p>
    </div>
  );
}
