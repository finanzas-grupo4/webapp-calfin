import http from "@/shared/services/http-common.js";

export class ProfileService {
    getProfileByUserId(userId) {
        return http.get(`/profiles/user/${userId}`);
    }

    updateProfile(profileId, updateRequest) {
        return http.put(`/profiles/${profileId}`, {
            username: updateRequest.username,
            email: updateRequest.email,
            age: updateRequest.age,
        });
    }
}