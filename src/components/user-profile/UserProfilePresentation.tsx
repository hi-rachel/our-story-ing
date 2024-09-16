import React from "react";
import { motion } from "framer-motion";
import { UserProfilePresentationProps } from "./types";
import ProfileImage from "./ProfileImage";
import ProfileDetails from "./ProfileDetails";
import EditForm from "./EditForm";
import EditAccountButton from "./EditAccountButton";
import DeleteAccountButton from "./DeleteAccountButton";

const UserProfilePresentation: React.FC<UserProfilePresentationProps> = ({
  user,
  userData,
  isEditing,
  editedUser,
  t,
  setIsEditing,
  handleInputChange,
  handleSubmit,
  handleDeleteAccount,
  handleImageDelete,
  handleImageUpload,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-lg shadow-card overflow-hidden relative"
      >
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-primary text-center">
            {t("profile.title")}
          </h1>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          {isEditing ? (
            <EditForm
              editedUser={editedUser}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              t={t}
              setIsEditing={setIsEditing}
              handleImageDelete={handleImageDelete}
              handleImageUpload={handleImageUpload}
            />
          ) : (
            <>
              <ProfileImage user={user} t={t} />
              <ProfileDetails user={user} userData={userData} t={t} />
              <div className="flex gap-4 justify-end p-4">
                <EditAccountButton setIsEditing={setIsEditing} t={t} />
                <DeleteAccountButton
                  handleDeleteAccount={handleDeleteAccount}
                  t={t}
                />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfilePresentation;
