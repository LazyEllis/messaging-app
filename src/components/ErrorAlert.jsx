import { XCircleIcon } from "@heroicons/react/24/solid";

const ErrorAlert = ({ error }) => (
  <div className="rounded-md bg-red-500/15 p-4 outline-1 outline-red-500/25">
    <div className="flex">
      <div className="shrink-0">
        <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
      </div>
      <div className="ml-3">
        {Array.isArray(error) ? (
          <>
            <p className="text-sm font-medium text-red-200">
              {error.length === 1
                ? "There was an error with your submission"
                : `There were ${error.length} errors with your submission`}
            </p>
            <div className="mt-2 text-sm text-red-200">
              <ul className="list-disc space-y-1 pl-5" role="list">
                {error.map((errorItem, index) => (
                  <li key={index}>{errorItem.msg}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-sm font-medium text-red-200">{error.message}</p>
        )}
      </div>
    </div>
  </div>
);

export default ErrorAlert;
