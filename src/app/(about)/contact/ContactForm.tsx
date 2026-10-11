"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { sendPublicMail } from "@/src/utils/publicMail";

type ContactFields = {
  name: string;
  email: string;
  phone: string;
  details: string;
};

const ContactForm = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
      } = useForm<ContactFields>();
      const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

      const onSubmit = async (data: ContactFields) => {
        setStatus(null);
        try {
          await sendPublicMail({
            type: "contact",
            subject: `Contact from ${data.name}`,
            name: data.name,
            email: data.email,
            phone: data.phone || undefined,
            message: data.details,
            metadata: { page: window.location.href },
          });
          reset();
          setStatus({ type: "success", text: "Thanks! Your message has been sent. We'll get back to you soon." });
        } catch (err) {
          setStatus({ type: "error", text: err instanceof Error ? err.message : "Unable to send your message." });
        }
      };


  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    className="mt-12 text-base xs:text-lg sm:text-xl font-medium leading-relaxed font-in"
  >
    Hello! My name is{" "}
    <input
        type="text"
        placeholder="your name"
        {...register("name", { required: true, maxLength: 80 })}
        className="outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-lg border-b border-gray
        focus:border-gray bg-transparent"
        />
        and I want to discuss a potential project. You can email me at
        <input type="email" placeholder="your@email" {...register("email", { required: true })}  className="outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-lg border-b border-gray
        focus:border-gray bg-transparent"/>
        or reach out to me on
        <input
        type="tel"
        placeholder="your phone"
        {...register("phone", { maxLength: 30 })}
        className="outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-lg border-b border-gray
        focus:border-gray bg-transparent"
        />
        Here are some details about my project: <br />
        <textarea {...register("details", { required: true, maxLength: 10000 })}
        placeholder="My project is about..."
        rows={3}
        className="w-full outline-none border-0 p-0 mx-0 focus:ring-0  placeholder:text-lg border-b border-gray
        focus:border-gray bg-transparent" />
        <input type="submit" disabled={isSubmitting} value={isSubmitting ? "sending..." : "send request"} className="mt-8 font-medium inline-block capitalize text-lg sm:text-xl py-2 sm:py-3 px-6 sm:px-8 border-2 border-solid border-dark dark:border-light rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
        {status && (
          <p className={`mt-4 text-base ${status.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
            {status.text}
          </p>
        )}
    </form>
  )
}

export default ContactForm
