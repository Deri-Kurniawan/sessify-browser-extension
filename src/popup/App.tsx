import RootLayout from "@/components/layouts/RootLayout";
import SessionPage from "@/components/pages/SessionPage";
import SettingsPage from "@/components/pages/SettingsPage";
import { SessionProvider } from "@/hooks/useSessions";
import { FC } from "react";
import { createHashRouter, RouterProvider } from "react-router";

interface AppProps {
  launchType?: React.ComponentProps<typeof RootLayout>["launchType"];
}

const App: FC<AppProps> = ({ launchType = "popup" }) => {
  let router = createHashRouter([
    {
      Component: (props) => <RootLayout {...props} launchType={launchType} />,
      children: [
        {
          path: "/",
          Component: SessionPage,
        },
        {
          path: "/settings",
          Component: SettingsPage,
        },
      ],
    },
  ]);

  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  );
};

export default App;
