import { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback | CrossFit Nord BVS",
  description:
    "Spune-ne parerea ta despre CrossFit Nord BVS. Feedback-ul tau ne ajuta sa ne imbunatatim constant.",
};

export default function FeedbackPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center font-heading text-4xl font-bold text-gold">
          FEEDBACK
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-grayText">
          Parerea ta conteaza! Spune-ne cum a fost experienta ta la CrossFit
          Nord BVS.
        </p>

        <div className="mt-12">
          <FeedbackForm />
        </div>
      </div>
    </section>
  );
}
