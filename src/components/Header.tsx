import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { auth } from "../../firebase";
import DefaultProfile from "./common/DefaultProfile";

const Header = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const user = auth.currentUser;

  const handleLogOut = async () => {
    const ok = confirm(t("common.logoutConfirm"));
    if (ok) {
      auth.signOut();
      router.reload();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-heading font-bold text-primary"
        >
          <img src={"/icons/couple.svg"} />
          {t("common.appName")}
        </Link>
        <div className="flex flex-wrap items-center space-x-4 sm:space-x-6 mt-2 sm:mt-0">
          <Link
            href="#features"
            className="text-text font-medium hover:text-primary transition duration-300 text-sm sm:text-base"
          >
            {t("home.features.title")}
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href={"/profile"}>
                <div className="flex items-center space-x-2">
                  {user.photoURL ? (
                    <Image
                      className="rounded-full border-2 border-primary"
                      src={user.photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <DefaultProfile size={32} />
                  )}
                  <span className="text-text font-semibold text-sm sm:text-base">
                    {user.displayName}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogOut}
                className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary hover:text-primary transition duration-300 shadow-button"
              >
                {t("common.logout")}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary hover:text-primary transition duration-300 shadow-button"
            >
              {t("common.login")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
