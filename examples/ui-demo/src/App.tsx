import { useEffect, useRef } from 'react';
import { QRLayoutDesigner, type EntitySchema, type StickerLayout } from 'qrlayout-ui';
import 'qrlayout-ui/style.css';

// Sample Schema
const SAMPLE_SCHEMAS: Record<string, EntitySchema> = {
  employee: {
    label: "Employee Badge",
    fields: [
      { name: "fullName", label: "Full Name" },
      { name: "employeeId", label: "Employee ID" },
      { name: "department", label: "Department" },
      { name: "joinDate", label: "Join Date" },
    ],
    sampleData: {
      fullName: "Alex Johnson",
      employeeId: "EMP-2024-889",
      department: "Engineering",
      joinDate: "2024-01-15"
    }
  },
  inventory: {
    label: "Inventory Label",
    fields: [
      { name: "sku", label: "SKU" },
      { name: "itemName", label: "Item Name" },
      { name: "category", label: "Category" },
      { name: "price", label: "Price" }
    ],
    sampleData: {
      sku: "INV-9920-X",
      itemName: "Wireless Mouse Pro",
      category: "Peripherals",
      price: "$49.99"
    }
  }
};

// Initial Layout
const INITIAL_LAYOUT: StickerLayout = {
  id: "layout-1",
  name: "Employee ID Card",
  targetEntity: "employee",
  width: 85,
  height: 54,
  unit: "mm",
  backgroundColor: "#ffffff",
  elements: [
    {
      id: "title",
      type: "text",
      x: 5,
      y: 5,
      w: 75,
      h: 8,
      content: "COMPANY NAME",
      style: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        verticalAlign: "middle"
      }
    },
    {
      id: "qr-code",
      type: "qr",
      x: 32.5,
      y: 15,
      w: 20,
      h: 20,
      content: "{{employeeId}}",
      qrSeparator: "|"
    },
    {
      id: "name-label",
      type: "text",
      x: 5,
      y: 38,
      w: 75,
      h: 6,
      content: "{{fullName}}",
      style: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center"
      }
    },
    {
      id: "dept-label",
      type: "text",
      x: 5,
      y: 44,
      w: 75,
      h: 5,
      content: "{{department}}",
      style: {
        fontSize: 10,
        textAlign: "center",
        color: "#666666"
      }
    }
  ]
};

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const designerRef = useRef<QRLayoutDesigner | null>(null);

  useEffect(() => {
    if (!containerRef.current || designerRef.current) return;

    // Initialize Designer
    designerRef.current = new QRLayoutDesigner({
      element: containerRef.current,
      entitySchemas: SAMPLE_SCHEMAS,
      initialLayout: INITIAL_LAYOUT,
      onSave: (layout) => {
        console.log("Saved Layout:", layout);
        alert(`Layout "${layout.name}" saved! Check console for JSON.`);
      }
    });

    return () => {
      if (designerRef.current) {
        designerRef.current.destroy();
        designerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            UI
          </div>
          <h1 className="text-xl font-semibold text-slate-800">QR Layout Studio</h1>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">
            Demo App
          </span>
        </div>
        <div className="flex gap-4 text-sm text-slate-500">
          <span>Using @qrlayout/ui</span>
          <span>v1.0.0</span>
        </div>
      </header>

      {/* Main Designer Area */}
      <main className="flex-1 p-6 h-[calc(100vh-64px)] overflow-hidden">
        <div
          className="w-full h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
          ref={containerRef}
          id="designer-wrapper" /* Targeted by scoped CSS override if needed */
        />
      </main>
    </div>
  )
}

export default App
