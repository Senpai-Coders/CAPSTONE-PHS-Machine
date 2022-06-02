import { useState, useEffect } from "react";

import Head from "next/head";
import Layout from "../components/layout";

import ThemeChooser from "../components/configuration/themeChooser";
import Debug from "../components/configuration/debug";

import axios from 'axios'

// import { FcCheckmark } from "react-icons/fc";
// import { HiOutlineSelector } from "react-icons/hi";
// import { Listbox, Transition } from "@headlessui/react";

const configuration = () => {
  
  return (
    <>
      <Head>
        <title>Configuration</title>
      </Head>
      <input type="checkbox" id="sys_off_modal" className="modal-toggle" />

      <p className="text-2xl card-title font-lato font-semibold">
        Configuration
      </p>
      <div>
        <Debug />
        <ThemeChooser />
      </div>
    </>
  );
};

configuration.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default configuration;
