export const logoTemplate = `   <tr>
                  <td
                    class="header"
                    style="
                      box-sizing: border-box;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Roboto, Helvetica, Arial, sans-serif,
                        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                      position: relative;
                      padding: 25px 0;
                      text-align: center;
                    "
                  >
                    <a
                      href="{{resetLink}}"
                      style="
                        box-sizing: border-box;
                        font-family: -apple-system, BlinkMacSystemFont,
                          'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                          'Apple Color Emoji', 'Segoe UI Emoji',
                          'Segoe UI Symbol';
                        position: relative;
                        color: #3d4852;
                        font-size: 19px;
                        font-weight: bold;
                        text-decoration: none;
                        display: inline-block;
                      "
                      ><img
                        alt="LOGO"
                        src="${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png"
                        style="
                          box-sizing: border-box;
                          font-family: -apple-system, BlinkMacSystemFont,
                            'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                            'Apple Color Emoji', 'Segoe UI Emoji',
                            'Segoe UI Symbol';
                          position: relative;
                          max-width: 100%;
                          border: none;
                          width: 190px;
                        "
                      />
                    </a>
                  </td>
                </tr>
`;
