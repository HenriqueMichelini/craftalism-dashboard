import DashboardLayout from "./layouts/DashboardLayout.tsx";
import Table from "./pages/Dashboard/components/Table.tsx";
import TableDescription from "./pages/Dashboard/components/TableDescription.tsx";

function App() {
  return (
    <DashboardLayout>
      <TableDescription />
      <Table />
    </DashboardLayout>
  );
}

export default App;
