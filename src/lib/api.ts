import axios from "axios";

const BASE_URL = "https://cloud-incident-reporter.onrender.com";

export const signUpUser = async (data: any) => {
    const response = await axios.post(`${BASE_URL}/api/v1/auth/signup`, data);
    console.log("Response from signup:", response.data)
    return response.data;
};

export const verifyOtp = async (otpCode: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/v1/auth/verify`, {
            otpCode,
        });
        console.log("OTP Verify Response:", response.data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to verify OTP"
        );
    }
};


export const loginUser = async (data: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, data);
        console.log("Login Response:", response.data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error || "Login failed. Please check your credentials."
        );
    }
};

export const forgotPassword = async (email: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/v1/auth/forgotpassword`, { email });
        console.log("Forgot Password Response:", response.data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to request password reset"
        );
    }
};

export const resetPassword = async (data: {
    otpCode: string;
    password: string;
    passwordConfirm: string;
}) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/v1/auth/resetpassword`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to reset password");
    }
};

export const getProfile = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/profile/get-profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Profile response:", response); // Add this line to log the full response
        return response.data;
    } catch (error: any) {
        console.error("Profile fetch error:", error); // Log the error to inspect more details
        throw new Error(
            error.response?.data?.error || "Failed to fetch profile."
        );
    }
};

export const setProfile = async (token: string, profileData: any) => {
    try {
        const response = await axios.put(`${BASE_URL}/api/v1/profile/set-profile`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Profile update error:", error.response?.data || error.message);
        throw new Error(
            error.response?.data?.error || "Failed to update profile."
        );
    }
};

export const getIncidents = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/api/v1/incident/get-incidents`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

export const updateIncident = async (id: string, data: any, token: string) => {
    const response = await axios.patch(
        `${BASE_URL}/api/v1/incident/update-incident/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const updateAudit = async (id: string, data: any, token: string) => {
    const response = await axios.patch(
        `${BASE_URL}/api/v1/audit/update-audit/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const deleteIncident = async (id: string, data: any, token: string) => {
    const response = await axios.patch(
        `${BASE_URL}/api/v1/incident/delete-incident/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const deleteAudit = async (id: string, data: any, token: string) => {
    const response = await axios.patch(
        `${BASE_URL}/api/v1/audit/delete-audit/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};


export const getAudits = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/api/v1/audit/all-audits`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

export const getReports = async () => {
    const response = await axios.get(`${BASE_URL}/api/v1/order/all-orders`);
    return response.data.data;
};

