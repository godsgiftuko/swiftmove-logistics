/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import ModalShipmentForm from '../components/ModalShipmentForm';
import ShipmentRepository from '../repositories/shipment';
import toast from 'react-hot-toast';
import { IDeliveryPayload } from '../../../shared/interfaces';
import { HTTP_STATUS } from '../../../shared/constants';

export default function ShipmentPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);


  const handleCreateShipment = (payload: IDeliveryPayload) => {
    const signinPromise = new Promise<any>((resolve, reject) => {
        setSubmitting(true);
        ShipmentRepository.createDelivery(payload)
          .then(({ data, message, status }) => {
           console.log({data});
            resolve(message);
          })
          .catch((error) => {
            if (error?.status === HTTP_STATUS.BAD_REQUEST) {
              return reject(error.response.data.message);
            }
            const errors = error.response.data.formattedErrors as Array<{
              field: string;
              message: string;
              value: string;
            }>;
            reject(errors);
          });
      }).finally(() => setSubmitting(false));

      toast
        .promise(signinPromise, {
          loading: "creating delivery...",
          success: (msg) => {
            return msg;
          },
        })
        .catch((err) => {
          if (Array.isArray(err)) {
            err.forEach((e: any) => toast.error(e.message));
          } else {
            toast.error(err);
          }
        });
  };
    
  return (
    <div className="p-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + New Shipment
      </button>

      <ModalShipmentForm
        isOpen={isModalOpen}
        submitting={submitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateShipment}
      />
    </div>
  );
}