import React from "react";

const UnauthorizedAccess = ({
  message = "You do not have permission to access this page.",
}) => {
  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-400/40 dark:bg-red-950 dark:text-red-100">
      <p className="text-lg font-semibold text-red-700 dark:text-red-200">
        Access Denied
      </p>
      <p className="mt-2 text-sm text-red-600 max-w-md dark:text-red-200">
        {message}
      </p>
    </div>
  );
};

export default UnauthorizedAccess;
