import { useState } from "react";

type DashboardView = "overview" | "transactions" | "users";

const [view, setView] = useState<DashboardView>("overview");
