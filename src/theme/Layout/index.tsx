import React from 'react';
import Layout from '@theme-original/Layout';
import FooterExtras from '../../components/FooterExtras';

export default function CustomLayout(props) {
  return (
    <>
      <Layout {...props} />
      <FooterExtras />
    </>
  );
}