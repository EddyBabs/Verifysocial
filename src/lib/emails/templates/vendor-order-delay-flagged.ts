import { logoTemplate } from "../partials/logo";

export const orderDelayFlagged = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <style type="text/css">
      @media only screen and (max-width: 600px) {
        .inner-body {
          width: 100% !important;
        }

        .footer {
          width: 100% !important;
        }
      }

      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body
    style="
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
      position: relative;
      -webkit-text-size-adjust: none;
      background-color: #ffffff;
      color: #718096;
      height: 100%;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      width: 100% !important;
    "
  >
    <table
      cellpadding="0"
      cellspacing="0"
      class="wrapper"
      role="presentation"
      style="
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
          'Segoe UI Symbol';
        position: relative;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        -premailer-width: 100%;
        background-color: #edf2f7;
        margin: 0;
        padding: 0;
        width: 100%;
      "
      width="100%"
    >
      <tbody>
        <tr>
          <td
            align="center"
            style="
              box-sizing: border-box;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                'Segoe UI Emoji', 'Segoe UI Symbol';
              position: relative;
            "
          >
            <table
              cellpadding="0"
              cellspacing="0"
              class="content"
              role="presentation"
              style="
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                  Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                  'Segoe UI Emoji', 'Segoe UI Symbol';
                position: relative;
                -premailer-cellpadding: 0;
                -premailer-cellspacing: 0;
                -premailer-width: 100%;
                margin: 0;
                padding: 0;
                width: 100%;
              "
              width="100%"
            >
              <tbody>
                ${logoTemplate}
                <!-- Email Body -->
                <tr>
                  <td
                    cellpadding="0"
                    cellspacing="0"
                    class="body"
                    style="
                      box-sizing: border-box;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Roboto, Helvetica, Arial, sans-serif,
                        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                      position: relative;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                      -premailer-width: 100%;
                      background-color: #edf2f7;
                      border-bottom: 1px solid #edf2f7;
                      border-top: 1px solid #edf2f7;
                      margin: 0;
                      padding: 0;
                      width: 100%;
                    "
                    width="100%"
                  >
                    <table
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      class="inner-body"
                      role="presentation"
                      style="
                        box-sizing: border-box;
                        font-family: -apple-system, BlinkMacSystemFont,
                          'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                          'Apple Color Emoji', 'Segoe UI Emoji',
                          'Segoe UI Symbol';
                        position: relative;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;
                        -premailer-width: 570px;
                        background-color: #ffffff;
                        border-color: #e8e5ef;
                        border-radius: 2px;
                        border-width: 1px;
                        box-shadow: 0 2px 0 rgba(0, 0, 150, 0.025),
                          2px 4px 0 rgba(0, 0, 150, 0.015);
                        margin: 0 auto;
                        padding: 0;
                        width: 570px;
                      "
                      width="570"
                    >
                      <!-- Body content -->
                      <tbody>
                        <tr>
                          <td
                            class="content-cell"
                            style="
                              box-sizing: border-box;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji',
                                'Segoe UI Symbol';
                              position: relative;
                              max-width: 100vw;
                              padding: 32px;
                            "
                          >
                            <h1
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                color: #3d4852;
                                font-size: 18px;
                                font-weight: bold;
                                margin-top: 0;
                                text-align: left;
                              "
                            >
                              Dear {{name}}!
                            </h1>

                            <p
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                font-size: 16px;
                                line-height: 1.5em;
                                margin-top: 0;
                                text-align: left;
                              "
                            >
                              Kindly note that the order
                              <b>#{{orderNumber}}</b> has not been delivered as
                              at the agreed time and date
                            </p>

                            <p>
                              Kindly fill the link to let us know why and how we
                              can salvage the relationship
                            </p>

                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                              "
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      box-sizing: border-box;
                                      font-family: -apple-system,
                                        BlinkMacSystemFont, 'Segoe UI', Roboto,
                                        Helvetica, Arial, sans-serif,
                                        'Apple Color Emoji', 'Segoe UI Emoji',
                                        'Segoe UI Symbol';
                                      position: relative;
                                    "
                                  >
                                    <a
                                      class="button button-primary"
                                      href="{{verifyOrderLink}}"
                                      rel="noopener"
                                      style="
                                        box-sizing: border-box;
                                        font-family: -apple-system,
                                          BlinkMacSystemFont, 'Segoe UI', Roboto,
                                          Helvetica, Arial, sans-serif,
                                          'Apple Color Emoji', 'Segoe UI Emoji',
                                          'Segoe UI Symbol';
                                        position: relative;
                                        -webkit-text-size-adjust: none;
                                        border-radius: 4px;
                                        color: #fff;
                                        display: inline-block;
                                        overflow: hidden;
                                        text-decoration: none;
                                        background-color: #2d3748;
                                        border-bottom: 8px solid #2d3748;
                                        border-left: 18px solid #2d3748;
                                        border-right: 18px solid #2d3748;
                                        border-top: 8px solid #2d3748;
                                      "
                                      target="_blank"
                                      >Verify Order</a
                                    >
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p>
                              Thank you for choosing Verify Social as your
                              trusted entity
                            </p>

                            <p
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                font-size: 16px;
                                line-height: 1.5em;
                                margin-top: 0;
                                text-align: left;
                              "
                            >
                              Best Regards,<br />
                              From verify social
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      box-sizing: border-box;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Roboto, Helvetica, Arial, sans-serif,
                        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                      position: relative;
                    "
                  >
                    <table
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      class="footer"
                      role="presentation"
                      style="
                        box-sizing: border-box;
                        font-family: -apple-system, BlinkMacSystemFont,
                          'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                          'Apple Color Emoji', 'Segoe UI Emoji',
                          'Segoe UI Symbol';
                        position: relative;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;
                        -premailer-width: 570px;
                        margin: 0 auto;
                        padding: 0;
                        text-align: center;
                        width: 570px;
                      "
                      width="570"
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            class="content-cell"
                            style="
                              box-sizing: border-box;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji',
                                'Segoe UI Symbol';
                              position: relative;
                              max-width: 100vw;
                              padding: 32px;
                            "
                          >
                            <p
                              style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Roboto, Helvetica, Arial,
                                  sans-serif, 'Apple Color Emoji',
                                  'Segoe UI Emoji', 'Segoe UI Symbol';
                                position: relative;
                                line-height: 1.5em;
                                margin-top: 0;
                                color: #b0adc5;
                                font-size: 12px;
                                text-align: center;
                              "
                            >
                              &copy; 2025 CC verify social. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

`;
