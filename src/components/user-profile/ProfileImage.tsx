import Image from "next/image";
import { ProfileImageProps } from "./types";
import DefaultProfile from "../common/DefaultProfile";

const ProfileImage: React.FC<ProfileImageProps> = ({ user, t }) => (
  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-500">{t("profile.image")}</dt>
    <dd className="mt-1 sm:mt-0 sm:col-span-2 flex justify-center sm:justify-start">
      {user.photoURL ? (
        <Image
          className="rounded-full border-2 border-primary"
          src={user.photoURL || "icons/heart.svg"}
          alt="Profile"
          width={64}
          height={64}
        />
      ) : (
        <DefaultProfile size={64} />
      )}
    </dd>
  </div>
);

export default ProfileImage;
