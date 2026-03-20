import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@crossfitnordbvs.com";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    return { success: true, mock: true };
  }

  try {
    const resend = getResend();
    if (!resend) return { success: false, error: "No API key" };
    const { data, error } = await resend.emails.send({
      from: `CrossFit Nord BVS <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email error:", error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}

export function reservationConfirmEmail(params: {
  userName: string;
  className: string;
  date: string;
  time: string;
  trainerName: string;
}) {
  return {
    subject: "Confirmare Rezervare - CrossFit Nord BVS",
    html: `
      <div style="font-family: 'Roboto', sans-serif; background: #121212; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E7B913; font-family: 'Space Grotesk', sans-serif; margin: 0;">CROSSFIT NORD BVS</h1>
        </div>
        <div style="background: #282828; border-radius: 8px; padding: 30px;">
          <h2 style="color: #E7B913; margin-top: 0;">Rezervare Confirmata!</h2>
          <p>Salut ${params.userName},</p>
          <p>Rezervarea ta a fost confirmata cu succes:</p>
          <div style="background: #1e1e1e; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Clasa:</strong> ${params.className}</p>
            <p style="margin: 5px 0;"><strong>Data:</strong> ${params.date}</p>
            <p style="margin: 5px 0;"><strong>Ora:</strong> ${params.time}</p>
            <p style="margin: 5px 0;"><strong>Antrenor:</strong> ${params.trainerName}</p>
          </div>
          <p style="color: #7A7A7A; font-size: 14px;">Poti anula rezervarea cu cel putin 2 ore inainte de inceperea clasei.</p>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #7A7A7A; font-size: 12px;">
          <p>CrossFit Nord BVS - Bucuresti, Romania</p>
        </div>
      </div>
    `,
  };
}

export function reservationCancelEmail(params: {
  userName: string;
  className: string;
  date: string;
  time: string;
}) {
  return {
    subject: "Rezervare Anulata - CrossFit Nord BVS",
    html: `
      <div style="font-family: 'Roboto', sans-serif; background: #121212; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E7B913; font-family: 'Space Grotesk', sans-serif; margin: 0;">CROSSFIT NORD BVS</h1>
        </div>
        <div style="background: #282828; border-radius: 8px; padding: 30px;">
          <h2 style="color: #E7B913; margin-top: 0;">Rezervare Anulata</h2>
          <p>Salut ${params.userName},</p>
          <p>Rezervarea ta a fost anulata:</p>
          <div style="background: #1e1e1e; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Clasa:</strong> ${params.className}</p>
            <p style="margin: 5px 0;"><strong>Data:</strong> ${params.date}</p>
            <p style="margin: 5px 0;"><strong>Ora:</strong> ${params.time}</p>
          </div>
          <p>Sesiunea a fost restaurata in abonamentul tau.</p>
        </div>
      </div>
    `,
  };
}

export function classReminderEmail(params: {
  userName: string;
  className: string;
  time: string;
  trainerName: string;
}) {
  return {
    subject: "Reminder: Clasa incepe in curand - CrossFit Nord BVS",
    html: `
      <div style="font-family: 'Roboto', sans-serif; background: #121212; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E7B913; font-family: 'Space Grotesk', sans-serif; margin: 0;">CROSSFIT NORD BVS</h1>
        </div>
        <div style="background: #282828; border-radius: 8px; padding: 30px;">
          <h2 style="color: #E7B913; margin-top: 0;">Clasa ta incepe in curand!</h2>
          <p>Salut ${params.userName},</p>
          <p>Iti reamintim ca ai o clasa programata:</p>
          <div style="background: #1e1e1e; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Clasa:</strong> ${params.className}</p>
            <p style="margin: 5px 0;"><strong>Ora:</strong> ${params.time}</p>
            <p style="margin: 5px 0;"><strong>Antrenor:</strong> ${params.trainerName}</p>
          </div>
          <p>Te asteptam! Nu uita sa iti iei echipamentul.</p>
        </div>
      </div>
    `,
  };
}

export function subscriptionExpiringEmail(params: {
  userName: string;
  packageName: string;
  endDate: string;
  daysLeft: number;
}) {
  return {
    subject: "Abonamentul tau expira curand - CrossFit Nord BVS",
    html: `
      <div style="font-family: 'Roboto', sans-serif; background: #121212; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E7B913; font-family: 'Space Grotesk', sans-serif; margin: 0;">CROSSFIT NORD BVS</h1>
        </div>
        <div style="background: #282828; border-radius: 8px; padding: 30px;">
          <h2 style="color: #E7B913; margin-top: 0;">Abonamentul Expira Curand</h2>
          <p>Salut ${params.userName},</p>
          <p>Abonamentul tau <strong>${params.packageName}</strong> expira in <strong>${params.daysLeft} zile</strong> (${params.endDate}).</p>
          <p>Reinnoieste-l pentru a continua sa te antrenezi cu noi!</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.NEXTAUTH_URL}/pachete" style="display: inline-block; background: #E7B913; color: #121212; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Vezi Pachetele</a>
          </div>
        </div>
      </div>
    `,
  };
}

export function subscriptionActivatedEmail(params: {
  userName: string;
  packageName: string;
  startDate: string;
  endDate: string;
  sessions: number | null;
}) {
  return {
    subject: "Abonament Activat - CrossFit Nord BVS",
    html: `
      <div style="font-family: 'Roboto', sans-serif; background: #121212; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E7B913; font-family: 'Space Grotesk', sans-serif; margin: 0;">CROSSFIT NORD BVS</h1>
        </div>
        <div style="background: #282828; border-radius: 8px; padding: 30px;">
          <h2 style="color: #E7B913; margin-top: 0;">Abonament Activat!</h2>
          <p>Salut ${params.userName},</p>
          <p>Abonamentul tau a fost activat cu succes:</p>
          <div style="background: #1e1e1e; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Pachet:</strong> ${params.packageName}</p>
            <p style="margin: 5px 0;"><strong>Perioada:</strong> ${params.startDate} - ${params.endDate}</p>
            <p style="margin: 5px 0;"><strong>Sedinte:</strong> ${params.sessions ?? "Nelimitat"}</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.NEXTAUTH_URL}/profil/rezervari" style="display: inline-block; background: #E7B913; color: #121212; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Fa o Rezervare</a>
          </div>
        </div>
      </div>
    `,
  };
}

export function feedbackReceivedEmail(params: {
  name: string;
  email: string;
  rating: number | null;
  message: string;
}) {
  return {
    subject: `Feedback nou de la ${params.name} - CrossFit Nord BVS`,
    html: `
      <div style="font-family: 'Roboto', sans-serif; background: #121212; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto;">
        <div style="background: #282828; border-radius: 8px; padding: 30px;">
          <h2 style="color: #E7B913; margin-top: 0;">Feedback Nou</h2>
          <p><strong>De la:</strong> ${params.name} (${params.email})</p>
          ${params.rating ? `<p><strong>Rating:</strong> ${"★".repeat(params.rating)}${"☆".repeat(5 - params.rating)}</p>` : ""}
          <div style="background: #1e1e1e; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p>${params.message}</p>
          </div>
        </div>
      </div>
    `,
  };
}
