import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  deleteLink,
  getAllLinks,
  postNewLink,
  putUpdateLink,
} from "../utils/api";
import { AuthContext } from "../App";
import Modal, { ModalHeader } from "../components/Modal";
import { useForm } from "react-hook-form";
import editIcon from "../assets/file-edit.svg";
import trashIcon from "../assets/trash-2.svg";
import copyIcon from "../assets/copy.svg";
import copyCheckIcon from "../assets/copy-check.svg";
import useGetAllLinks from "../utils/hooks/UseGetAllLinks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

const Links = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [copied, setCopied] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [createState, setCreateState] = useState("pending");
  const [chooseSlug, setChooseSlug] = useState("");
  const { fetchDataState, data } = useGetAllLinks();
  const navigate = useNavigate();

  const handleQrOpen = () => {
    setShowQr(true);
  };
  const handleQrClose = () => {
    setChooseSlug("");
    setShowQr(false);
  };
  const handleModalOpen = () => {
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleEditModalOpen = (slug) => {
    setChooseSlug(slug);
    setShowEditModal(true);
  };
  const handleEditModalClose = () => {
    setChooseSlug("");
    setShowEditModal(false);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard:", text);
        toast("Link copied!");
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard:", err);
      });
  };

  const getQr = async (url) => {
    try {
      setCreateState("loading");
      console.log(url);
      setChooseSlug(`${url}`);
      handleQrOpen();
      setCreateState("success");
    } catch (error) {
      console.log(error);
      setCreateState("error");
    }
  };

  const linkDeletion = async (slug) => {
    try {
      await deleteLink(jwtCookie, slug);
      console.log("link deleted!");
      fetchLinks();
    } catch (error) {
      console.error("Error deleting the link:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setCreateState("loading");
      console.log(jwtCookie);
      const newLink = await postNewLink(jwtCookie, {
        link: data.link,
      });
      setCreateState("success");
      fetchLinks();
      handleModalClose();
    } catch (error) {
      const serverErrors = error?.response?.data?.data?.errors || [];
      setCreateState("error");
      console.log(serverErrors);
    }
  };

  const onEditSubmit = async (newLinkValue) => {
    try {
      const currentSlug = chooseSlug;
      console.log(newLinkValue.link, jwtCookie, currentSlug);
      const response = await putUpdateLink(jwtCookie, currentSlug, {
        link: newLinkValue.link,
      });

      if (response.status === 200) {
        console.log("Link updated!");
        fetchLinks();
        setChooseSlug("");
        setShowEditModal(false);
      } else {
        console.error("Error updating the link:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer />
      <Modal isShown={showModal} setShow={setShowModal}>
        <ModalHeader title="Create a new link!" />
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                type="text"
                className="block border border-gray-400 p-2 rounded w-full mb-4"
                placeholder="Enter link destination"
                {...register("link", { required: true })}
              />
              {errors.link && (
                <p role="alert" className="text-red-600">
                  {"This field is required"}
                </p>
              )}
            </div>
            <button className="text-center bg-pink-500 text-white border pl-4 pr-4 py-2 block w-full hover:bg-pink-500/80 rounded-md">
              Create my link!
            </button>
          </form>
        </div>
        <button
          onClick={handleModalClose}
          className="text-center bg-transparent text-black
           border pl-4 pr-4 py-2 block w-full hover:bg-pink-500/10 rounded-md"
        >
          Cancel
        </button>
      </Modal>
      <Modal isShown={showEditModal} setShow={setShowEditModal}>
        <ModalHeader title="Update existing link" />
        <div>
          <form onSubmit={handleSubmit(onEditSubmit)}>
            <div>
              <input
                type="text"
                className="block border border-gray-400 p-2 rounded w-full mb-4"
                placeholder="Enter new destination link!"
                {...register("link", { required: true })}
              />
              {errors.link && (
                <p role="alert" className="text-red-600">
                  {"This field is required"}
                </p>
              )}
            </div>
            <button className="text-center bg-pink-500 text-white border pl-4 pr-4 py-2 block w-full hover:bg-pink-500/80 rounded-md">
              Update link!
            </button>
          </form>
        </div>
        <button
          onClick={handleEditModalClose}
          className="text-center bg-transparent text-black
           border pl-4 pr-4 py-2 block w-full hover:bg-pink-500/10 rounded-md"
        >
          Cancel
        </button>
      </Modal>
      <Modal isShown={showQr} setShow={setShowQr}>
        <ModalHeader title="Scan the Qr code!" />
        <div>
          <div
            className="flex flex-col items-center"
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 128,
              width: "100%",
            }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={chooseSlug}
              viewBox={`0 0 256 256`}
            />
            <p
              className="hover:underline hover:text-blue-500 hover:cursor-pointer py-4"
              onClick={() => {
                window.open(`${chooseSlug}`, "_blank");
              }}
            >
              {chooseSlug}
            </p>
          </div>
        </div>
        <button
          onClick={handleQrClose}
          className="text-center bg-transparent text-black
           border pl-4 pr-4 py-2 block w-full hover:bg-pink-500/10 rounded-md"
        >
          Close
        </button>
      </Modal>
      <div className="p-4 h-screen overflow-y-auto bg-gray-100">
        <div className="h-[40px] flex justify-between items-center mb-8 ">
          <h4 className="text-2xl font-semibold text-pink-500">Links</h4>
          <button
            onClick={handleModalOpen}
            className="bg-pink-500 p-2 rounded text-white"
          >
            + New link
          </button>
        </div>
        <table className="table-auto w-full bg-white">
          <thead>
            <tr>
              <th className="border">No.</th>
              <th className="border">Destination</th>
              <th className="border">Link</th>
              <th className="border">Get QR</th>
              <th className="border">Visit count</th>
              <th className="border">Created at</th>
              <th className="border">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((column, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{column.link}</td>
                <td className="border p-2">
                  <span>{`${BASE_URL}/${column.slug}`}</span>
                  <button
                    className="rounded-md hover:bg-gray-200 transition-all"
                    onClick={() =>
                      copyToClipboard(`${BASE_URL}/${column.slug}`, index)
                    }
                  >
                    {copied === index ? (
                      <img src={copyCheckIcon} alt="copy check icon" />
                    ) : (
                      <img src={copyIcon} alt="copy icon" />
                    )}
                  </button>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      getQr(`${BASE_URL}/${column.slug}`);
                    }}
                    className="on hover:underline text-blue-500"
                  >
                    View
                  </button>
                </td>
                <td className="border p-2">{column.visit_counts}</td>
                <td className="border p-2">-</td>
                <td className="border p-2 flex justify-center">
                  <div className="flex">
                    <img
                      onClick={() => {
                        linkDeletion(column.slug);
                      }}
                      src={trashIcon}
                      alt="trash icon"
                      className="rounded-md hover:bg-gray-200 transition-all cursor-pointer"
                    />
                    <img
                      onClick={() => {
                        handleEditModalOpen(column.slug);
                      }}
                      src={editIcon}
                      alt="edit icon"
                      className="rounded-md hover:bg-gray-200 transition-all cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Links;
