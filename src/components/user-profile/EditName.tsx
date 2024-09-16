import { EditFieldProps } from "./types";

const EditName: React.FC<EditFieldProps> = ({
  editedUser,
  handleInputChange,
  t,
}) => (
  <div>
    <label
      htmlFor="displayName"
      className="block text-sm font-medium text-gray-700"
    >
      {t("profile.name")}
    </label>
    <input
      name="displayName"
      id="displayName"
      value={editedUser.displayName}
      onChange={handleInputChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
    />
  </div>
);

export default EditName;
