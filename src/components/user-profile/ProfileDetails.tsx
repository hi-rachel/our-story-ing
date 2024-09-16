import { ProfileDetailsProps } from "./types";

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  user,
  userData,
  t,
}) => (
  <>
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{t("profile.name")}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {user.displayName}
      </dd>
    </div>
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">
        {t("profile.email")}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {user.email}
      </dd>
    </div>
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{t("profile.bio")}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {userData.profileMessage || t("profile.noBio")}
      </dd>
    </div>
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">
        {t("profile.partner")}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {userData.isCouple
          ? userData.partnerId || t("profile.noPartner")
          : t("profile.single")}
      </dd>
    </div>
  </>
);

export default ProfileDetails;
