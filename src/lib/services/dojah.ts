import axios, { AxiosInstance } from "axios";

export interface IDojaService {
  appId: string;
  environment: "sandbox" | "live";
  secretKey: string;
  publicKey?: string;
  version?: "v1" | "v2";
}

export class DojahService {
  private appId: string;
  private environment: "sandbox" | "live";
  private secretKey: string;
  // private publicKey: string;
  private axiosInstance: AxiosInstance;
  private version: "v1" | "v2" = "v1";

  constructor(options: IDojaService) {
    this.appId = options.appId;
    this.environment = options.environment;
    this.secretKey = options.secretKey;

    let baseURL =
      this.environment === "live"
        ? "https://api.dojah.io"
        : "https://sandbox.dojah.io";

    baseURL = [baseURL, "api", this.version].join("/");
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Authorization: this.secretKey,
        "Content-Type": "application/json",
        AppId: this.appId,
      },
    });
  }

  public async documentAnalyze(
    imageFrontSide: string,
    imageBackSide: string
  ): Promise<any> {
    const response = await this.axiosInstance.post("/document/analysis", {
      imageFrontSide,
      imageBackSide,
    });
    return response.data;
  }

  public async lookupDriversLicence(drivers_licence: string): Promise<any> {
    const response = await this.axiosInstance.get("/kyc/dl", {
      params: {
        license_number: drivers_licence,
      },
    });
    return response.data;
  }

  public async lookupVotersID(voters_id: string): Promise<any> {
    const response = await this.axiosInstance.get("/kyc/vin", {
      params: {
        vin: voters_id,
      },
    });
    return response.data;
  }

  public async lookupNIN(nin: string): Promise<any> {
    const response = await this.axiosInstance.get("/kyc/nin", {
      params: {
        nin: nin,
      },
    });

    return response.data;
  }

  public async lookupPassport(passport_number: string): Promise<any> {
    const response = await this.axiosInstance.get("/kyc/passport", {
      params: {
        passport_number,
      },
    });
    return response.data;
  }

  public async lookupBVN(bvn: string): Promise<any> {
    const response = await this.axiosInstance.get("/kyc/bvn/full", {
      params: {
        bvn,
      },
    });
    return response.data;
  }
}
