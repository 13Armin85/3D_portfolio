"use client";

import { useI18n } from "../locale-provider";
import { useRef, useState, type FormEvent } from "react";
import { CheckCheck, Send } from "lucide-react";

export function ContactForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const sending = status === "sending";

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    inFlight.current = true;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(values)),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(
          typeof result?.error === "string"
            ? t(result.error)
            : t("Your message could not be sent. Please try again."),
        );
        setStatus("error");
        return;
      }
      if (!result?.message) throw new Error("Invalid response");
      form.reset();
      setStatus("success");
    } catch {
      setError(
        t("Could not connect. Please try again or use the email link above."),
      );
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <form className="contact-form" onSubmit={sendMessage} aria-busy={sending}>
      <div className="form-row">
        <label>
          {t("Your name")}{" "}
          <input
            name="name"
            placeholder={t("Alex Johnson")}
            autoComplete="name"
            required
            maxLength={100}
            disabled={sending}
          />
        </label>
        <label>
          {t("Email address")}{" "}
          <input
            name="email"
            type="email"
            dir="ltr"
            placeholder="alex@example.com"
            autoComplete="email"
            required
            maxLength={254}
            disabled={sending}
          />
        </label>
      </div>
      <label>
        {t("What’s on your mind?")}{" "}
        <textarea
          name="message"
          placeholder={t("A little about your idea…")}
          required
          minLength={10}
          maxLength={3000}
          rows={4}
          disabled={sending}
        />
      </label>
      <div hidden aria-hidden="true">
        <label>
          {t("Website")}{" "}
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        className="primary-button full-width"
        disabled={sending}
      >
        {sending ? t("Sending your message…") : t("Let’s start a conversation")}{" "}
        <Send size={16} />
      </button>
      <p className="small-note">
        {t("Your message goes straight to my inbox.")}
      </p>
      <div role="status" aria-live="polite">
        {status === "success" && (
          <p className="form-status">
            <CheckCheck size={17} />{" "}
            {t("Thanks! Your message has been sent.")}{" "}
          </p>
        )}
      </div>
      {status === "error" && (
        <p className="small-note" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
