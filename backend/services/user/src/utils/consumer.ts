import { consumeMessages } from "@buffalo/shared"
import { User } from "../model/usermodel.js"
import transporter from "./nodemailer.js"

interface IConsume{
    name:string,
    email:string,
    avatar:string,
    authid:string

}

const createuser=async()=>{

    await consumeMessages<IConsume>("authex","exauth","user",async(data)=>{

        const user=await User.create({
            email:data.email,
            authid:data.authid,
            avatar:data.avatar,
            name:data.name
        })



        if(user){

           const mailOptions = {
  from: `"BuffaloIDE" <${process.env.SENDER_EMAIL}>`,
  to: data.email,
  subject: "Welcome to BuffaloIDE 🚀 — Your AI Coding Workspace Is Ready",
  text: `Welcome to BuffaloIDE!

Your AI-powered coding workspace is ready.

Open BuffaloIDE and start building with AI-powered assistance.

https://buffaloide.com/dashboard`,

  html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#0d1117; font-family:Arial, Helvetica, sans-serif;">

    <!-- Main Background -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="width:100%; background-color:#0d1117; padding:40px 12px;">
      <tr>
        <td align="center">

          <!-- Email Container -->
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
            style="width:100%; max-width:600px; background-color:#161b22; border:1px solid #30363d; border-radius:14px; overflow:hidden;">

            <!-- Top IDE Accent -->
            <tr>
              <td style="height:4px; background-color:#58a6ff; font-size:1px; line-height:1px;">&nbsp;</td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="padding:30px 32px 24px; border-bottom:1px solid #30363d;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <!-- Logo -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="width:42px; height:42px; background-color:#238636; border-radius:10px; text-align:center; vertical-align:middle; font-size:20px;">
                            🦬
                          </td>
                          <td style="padding-left:12px;">
                            <div style="font-size:20px; font-weight:700; color:#f0f6fc;">
                              Buffalo<span style="color:#58a6ff;">IDE</span>
                            </div>
                            <div style="font-size:12px; color:#8b949e; margin-top:3px;">
                              AI-powered coding workspace
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <!-- Status -->
                    <td align="right">
                      <span style="display:inline-block; background-color:#1f6f3a; color:#ffffff; font-size:11px; font-weight:600; padding:7px 10px; border-radius:20px;">
                        ● WORKSPACE READY
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Terminal Welcome -->
            <tr>
              <td style="padding:32px;">
                <div style="background-color:#0d1117; border:1px solid #30363d; border-radius:10px; overflow:hidden;">

                  <!-- Terminal Header -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#21262d;">
                    <tr>
                      <td style="padding:12px 16px;">
                        <span style="font-size:12px; color:#8b949e;">terminal — welcome.sh</span>
                      </td>
                      <td align="right" style="padding:12px 16px;">
                        <span style="font-size:11px; color:#6e7681;">● ● ●</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Terminal Content -->
                  <div style="padding:22px 20px; font-family:Menlo, Monaco, Consolas, monospace;">
                    <div style="font-size:14px; line-height:1.8; color:#58a6ff;">
                      <span style="color:#3fb950;">➜</span>
                      <span style="color:#c9d1d9;"> buffaloide</span>
                      <span style="color:#8b949e;"> init workspace</span>
                    </div>
                    <div style="font-size:14px; line-height:1.8; color:#3fb950;">
                      ✓ AI coding environment initialized
                    </div>
                    <div style="font-size:14px; line-height:1.8; color:#3fb950;">
                      ✓ Intelligent agents connected
                    </div>
                    <div style="font-size:14px; line-height:1.8; color:#f0f6fc;">
                      Welcome to <span style="color:#58a6ff;">BuffaloIDE</span>! 🚀
                    </div>
                  </div>

                </div>
              </td>
            </tr>

            <!-- Welcome Text -->
            <tr>
              <td style="padding:0 32px 12px;">
                <h1 style="margin:0 0 14px; color:#f0f6fc; font-size:26px; line-height:1.3; font-weight:700;">
                  Ready to build something amazing?
                </h1>
                <p style="margin:0; color:#8b949e; font-size:15px; line-height:1.7;">
                  Your BuffaloIDE workspace is ready. Write code, solve problems,
                  and build faster with intelligent AI assistance directly in your
                  development environment.
                </p>
              </td>
            </tr>

            <!-- Account -->
            <tr>
              <td style="padding:20px 32px 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                  style="background-color:#0d1117; border:1px solid #30363d; border-radius:8px;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#6e7681; margin-bottom:6px;">
                        Signed in as
                      </div>
                      <div style="font-family:Menlo, Monaco, Consolas, monospace; font-size:13px; color:#58a6ff; font-weight:600;">
                        ${data.email}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Features -->
            <tr>
              <td style="padding:26px 32px 10px;">
                <h2 style="margin:0 0 16px; color:#f0f6fc; font-size:18px; font-weight:600;">
                  Your developer toolkit
                </h2>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                  <!-- Feature 1 -->
                  <tr>
                    <td style="padding:6px 0;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="background-color:#21262d; border:1px solid #30363d; border-radius:10px;">
                        <tr>
                          <td style="width:48px; padding:16px; text-align:center; vertical-align:top; font-size:22px;">
                            🤖
                          </td>
                          <td style="padding:16px 16px 16px 0;">
                            <div style="color:#f0f6fc; font-size:14px; font-weight:700; margin-bottom:5px;">
                              AI Coding Assistant
                            </div>
                            <div style="color:#8b949e; font-size:12px; line-height:1.5;">
                              Generate code, explain complex logic, and solve development problems faster.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Feature 2 -->
                  <tr>
                    <td style="padding:6px 0;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="background-color:#21262d; border:1px solid #30363d; border-radius:10px;">
                        <tr>
                          <td style="width:48px; padding:16px; text-align:center; vertical-align:top; font-size:22px;">
                            ⚡
                          </td>
                          <td style="padding:16px 16px 16px 0;">
                            <div style="color:#f0f6fc; font-size:14px; font-weight:700; margin-bottom:5px;">
                              Faster Development
                            </div>
                            <div style="color:#8b949e; font-size:12px; line-height:1.5;">
                              Move from idea to working code with intelligent AI-powered workflows.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Feature 3 -->
                  <tr>
                    <td style="padding:6px 0;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="background-color:#21262d; border:1px solid #30363d; border-radius:10px;">
                        <tr>
                          <td style="width:48px; padding:16px; text-align:center; vertical-align:top; font-size:22px;">
                            🧠
                          </td>
                          <td style="padding:16px 16px 16px 0;">
                            <div style="color:#f0f6fc; font-size:14px; font-weight:700; margin-bottom:5px;">
                              Smart Problem Solving
                            </div>
                            <div style="color:#8b949e; font-size:12px; line-height:1.5;">
                              Get help debugging errors, understanding code, and exploring solutions.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding:28px 32px 34px;">
                <a href="https://buffaloide.com/dashboard" target="_blank"
                  style="display:inline-block; background-color:#238636; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:14px 30px; border-radius:8px;">
                  Open BuffaloIDE →
                </a>
                <p style="margin:14px 0 0; color:#6e7681; font-size:12px;">
                  Your next project is waiting.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 32px;">
                <div style="height:1px; background-color:#30363d;"></div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:28px 32px 32px;">
                <div style="font-size:13px; color:#8b949e; line-height:1.6;">
                  Need help? Simply reply to this email — we're here to help you build.
                </div>
                <div style="font-family:Menlo, Monaco, Consolas, monospace; font-size:11px; color:#484f58; margin-top:16px;">
                  © ${new Date().getFullYear()} BuffaloIDE · AI-powered development
                </div>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
};
await transporter.sendMail(mailOptions)






        }

        

    })
}

export{createuser}