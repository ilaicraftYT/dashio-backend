export interface DashboardDocument {
  _id: string;
  display_name: string;
  data: string;
  auth_key: string;
  premium: boolean;
}

export interface UpdateDashboardBody {
  id: string;
  data: {
    pages: DashboardPage[]
  }
}

export interface DashboardPage {
  display_name: string;
  options: DashboardOption[]
}

export interface DashboardOption {
  id: string;
  display_name: string;
  limits?: Partial<{
    /**
     * For text based inputs, it means the maximum characters allowed.
     * For multiple-select inputs, the maximum of items allowed.
     * Means the maximum value available in the slider.
     */
    max: number;
    /**
     * For text based inputs, it means the minimum characters allowed.
     * For multiple-select inputs, the minimum of items.
     * Means the minimum value available in the slider.
     */
    min: number;
  }>;
  name: "checkbox" | "input" | "textarea" | "multirow" | "slider";
}