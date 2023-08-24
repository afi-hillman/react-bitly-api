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

const BASE_URL = import.meta.env.VITE_API_URL;

const Links = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { jwtCookie } = useContext(AuthContext);
  const [fetchDataState, setFetchDataState] = useState("pending");
  const [data, setData] = useState([]);
  const [copied, setCopied] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [createState, setCreateState] = useState("pending");
  const [chooseSlug, setChooseSlug] = useState("");

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

  const copyToClipboard = (text, index) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard:", text);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard:", err);
      });
  };

  const fetchLinks = async () => {
    try {
      setFetchDataState("loading");
      const dataLinks = await getAllLinks(jwtCookie);
      console.log(dataLinks.data.data);
      setFetchDataState("success");
      setData(dataLinks.data.data);
    } catch (error) {
      setFetchDataState("error");
    }
  };
  useEffect(() => {
    fetchLinks();
  }, []);

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
      showModal(false);
    } catch (error) {
      const serverErrors = error?.response?.data?.data?.errors || [];
      setCreateState("error");
      console.log(serverErrors);
    }
  };

  return (
    <DashboardLayout>
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
                <td className="border p-2">{column.visit_counts}</td>
                <td className="border p-2">-</td>
                <td className="border p-2 flex justify-center">
                  {/* <button
                    onClick={() => {
                      linkDeletion(column.slug);
                    }}
                    className="border bg-pink-500 text-white rounded-md px-6 py-1 hover:bg-pink-500/80"
                  >
                    Delete
                  </button> */}
                  <div>
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
