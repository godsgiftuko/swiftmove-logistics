import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ButtonLoader from "./ButtonLoader";
import { IDeliveryPayload } from "@/interfaces";

interface ModalShipmentFormProps {
  isOpen: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: IDeliveryPayload) => void;
}

const validationSchema = Yup.object().shape({
  customerName: Yup.string().required("Required"),
  customerPhone: Yup.string().required("Required"),
  customerEmail: Yup.string().email("Invalid email").required("Required"),

  pickupStreet: Yup.string().required("Required"),
  pickupCity: Yup.string().required("Required"),
  pickupState: Yup.string().required("Required"),
  pickupZipCode: Yup.string().required("Required"),
  pickupLat: Yup.number().required("Required"),
  pickupLng: Yup.number().required("Required"),

  destStreet: Yup.string().required("Required"),
  destCity: Yup.string().required("Required"),
  destState: Yup.string().required("Required"),
  destZipCode: Yup.string().required("Required"),
  destLat: Yup.number().required("Required"),
  destLng: Yup.number().required("Required"),

  parcelName: Yup.string().required("Required"),
  parcelWeightInKg: Yup.number().positive("Must be positive").required("Required"),
  parcelQuantity: Yup.number().positive("Must be positive").required("Required"),
  parcelDescription: Yup.string(),

  priority: Yup.string().oneOf(["low", "medium", "high"]).required("Required"),
  estimatedDeliveryDate: Yup.date().required("Required"),
  notes: Yup.string(),
});

export default function ModalShipmentForm({
  isOpen,
  onClose,
  onSubmit,
  submitting,
}: ModalShipmentFormProps) {
  if (!isOpen) return null;

  const initialValues: IDeliveryPayload = {
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    pickupStreet: "",
    pickupCity: "",
    pickupState: "",
    pickupZipCode: "",
    pickupLat: "",
    pickupLng: "",
    destStreet: "",
    destCity: "",
    destState: "",
    destZipCode: "",
    destLat: "",
    destLng: "",
    parcelName: "",
    parcelWeightInKg: "",
    parcelQuantity: "",
    parcelIsFragile: false,
    parcelDescription: "",
    priority: "medium",
    estimatedDeliveryDate: "",
    notes: "",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-7xl w-full max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create New Shipment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values);
            resetForm();
            onClose();
          }}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Layout: Horizontal sections */}
              <div className="flex flex-wrap gap-6">
                {/* Customer Info */}
                <div className="flex-1 min-w-[280px] border border-gray-300 rounded-md p-4">
                  <h3 className="mb-4 font-semibold text-lg">Customer Info</h3>
                  {[
                    { name: "customerName", label: "Name", type: "text" },
                    { name: "customerPhone", label: "Phone", type: "tel" },
                    { name: "customerEmail", label: "Email", type: "email" },
                  ].map(({ name, label, type }) => (
                    <div key={name} className="mb-3">
                      <label className="block text-sm font-medium mb-1" htmlFor={name}>
                        {label}
                      </label>
                      <Field
                        id={name}
                        name={name}
                        type={type}
                        className={`w-full border rounded px-3 py-2 ${
                          errors[name as keyof IDeliveryPayload] &&
                          touched[name as keyof IDeliveryPayload]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  ))}
                </div>

                {/* Pickup Address */}
                <div className="flex-1 min-w-[280px] border border-gray-300 rounded-md p-4">
                  <h3 className="mb-4 font-semibold text-lg">Pickup Address</h3>
                  {[
                    { name: "pickupStreet", label: "Street", type: "text" },
                    { name: "pickupCity", label: "City", type: "text" },
                    { name: "pickupState", label: "State", type: "text" },
                    { name: "pickupZipCode", label: "Zip Code", type: "text" },
                    { name: "pickupLat", label: "Latitude", type: "number" },
                    { name: "pickupLng", label: "Longitude", type: "number" },
                  ].map(({ name, label, type }) => (
                    <div key={name} className="mb-3">
                      <label className="block text-sm font-medium mb-1" htmlFor={name}>
                        {label}
                      </label>
                      <Field
                        id={name}
                        name={name}
                        type={type}
                        className={`w-full border rounded px-3 py-2 ${
                          errors[name as keyof IDeliveryPayload] &&
                          touched[name as keyof IDeliveryPayload]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  ))}
                </div>

                {/* Destination Address */}
                <div className="flex-1 min-w-[280px] border border-gray-300 rounded-md p-4">
                  <h3 className="mb-4 font-semibold text-lg">Destination Address</h3>
                  {[
                    { name: "destStreet", label: "Street", type: "text" },
                    { name: "destCity", label: "City", type: "text" },
                    { name: "destState", label: "State", type: "text" },
                    { name: "destZipCode", label: "Zip Code", type: "text" },
                    { name: "destLat", label: "Latitude", type: "number" },
                    { name: "destLng", label: "Longitude", type: "number" },
                  ].map(({ name, label, type }) => (
                    <div key={name} className="mb-3">
                      <label className="block text-sm font-medium mb-1" htmlFor={name}>
                        {label}
                      </label>
                      <Field
                        id={name}
                        name={name}
                        type={type}
                        className={`w-full border rounded px-3 py-2 ${
                          errors[name as keyof IDeliveryPayload] &&
                          touched[name as keyof IDeliveryPayload]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  ))}
                </div>

                {/* Parcel Info */}
                <div className="flex-1 min-w-[280px] border border-gray-300 rounded-md p-4">
                  <h3 className="mb-4 font-semibold text-lg">Parcel Info</h3>
                  {[
                    { name: "parcelName", label: "Name", type: "text" },
                    { name: "parcelWeightInKg", label: "Weight (kg)", type: "number" },
                    { name: "parcelQuantity", label: "Quantity", type: "number" },
                    { name: "parcelDescription", label: "Description", type: "text" },
                    {
                        name: "parcelIsFragile",
                        label: "Fragile",
                        type: "checkbox",
                      },
                  ].map(({ name, label, type }) => (
                    <div key={name} className={`mb-3 flex ${type !== 'checkbox' ? 'flex-col' : ''}`}>
                      {type === "checkbox" ? (
                        <>
                          <Field
                            id={name}
                            name={name}
                            type="checkbox"
                            className="mr-2"
                          />
                          <label htmlFor={name} className="font-medium">
                            {label}
                          </label>
                        </>
                      ) : (
                        <>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor={name}
                          >
                            {label}
                          </label>
                          <Field
                            id={name}
                            name={name}
                            as={label === "Description" ? "textarea" : ""}
                            type={type}
                            className={`w-full ${label === 'Description' ? 'h-30' : ''} border rounded px-3 py-2 ${
                              errors[name as keyof IDeliveryPayload] &&
                              touched[name as keyof IDeliveryPayload]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          <ErrorMessage
                            name={name}
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority, Delivery Date, Notes */}
              <div className="flex flex-wrap gap-6 items-end">
                <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium mb-1"
                  >
                    Priority
                  </label>
                  <Field
                    as="select"
                    id="priority"
                    name="priority"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Field>
                  <ErrorMessage
                    name="priority"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="estimatedDeliveryDate"
                    className="block text-sm font-medium mb-1"
                  >
                    Estimated Delivery Date
                  </label>
                  <Field
                    type="date"
                    id="estimatedDeliveryDate"
                    name="estimatedDeliveryDate"
                    className={`w-full border rounded px-3 py-2 ${
                      errors.estimatedDeliveryDate && touched.estimatedDeliveryDate
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="estimatedDeliveryDate"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium mb-1"
                  >
                    Notes
                  </label>
                  <Field
                    as="textarea"
                    id="notes"
                    name="notes"
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                disabled={submitting}
                type="submit"
                className="mt-4 w-full bg-[#cf1112] text-white py-3 rounded hover:bg-[#b50e0f] transition"
              >
                {submitting && <ButtonLoader /> || 'Create Shipment'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
