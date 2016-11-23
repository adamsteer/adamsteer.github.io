
```
#!/bin/bash
#Build the PCVM


##note - this script is not ready for launch yet, trying to run it will break.
##also some tidy ups to come.




### to do - turn ccmake builds into one-liners 
### 




#taken heavily from here:
# https://github.com/PDAL/PDAL/tree/master/scripts/linux-install-scripts


yum install bzip2 gcc-c++ curl-devel lzma xz-devel lzip libarchive-devel expat-devel jsoncpp jsoncpp-devel ncurses-devel


#more yum installs


yum install CUnit-devel


yum install cmake3 cmake-gui


yum install bzip2-devel   libxml2-devel  


yum install proj proj-devel geos geos-devel libtiff libtiff-devel gdal gdal-devel libgeotiff libgeotiff-devel


yum install boost boost-devel


yum install postgresql95-devel


 yum install  hdf5-devel
yum install netcdf4-devel
yum install numpy




#laz-perf
cd /local/build

git clone https://github.com/verma/laz-perf.git laz-perf
cd laz-perf
cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=/usr . && make && make install
cd ../


#laszip
git clone https://github.com/LASzip/LASzip.git laszip
cd laszip
git checkout 6de83bc3f4abf6ca30fd07013ba76b06af0d2098
cmake . -DCMAKE_INSTALL_PREFIX=/usr && make && make install
cd -




#git clone https://github.com/LASzip/LASzip.git laszip
#cd laszip/
#cmake . -DCMAKE_INSTALL_PREFIX=/usr
#make
#make install
#cd ../


#hexer
git clone https://github.com/hobu/hexer.git
cd hexer
cmake . -DCMAKE_INSTALL_PREFIX=/usr -DWITH_GDAL=ON
make
make install


#p2g
git clone https://github.com/CRREL/points2grid.git
cd points2grid/


cmake . -DCMAKE_INSTALL_PREFIX=/usr


#libGHT (for postgres-pointcloud)
git clone https://github.com/pramsey/libght.git
cd libght
cmake . -DCMAKE_INSTALL_PREFIX=/usr
Make
make install
cd ../


#pgpointcloud
git clone https://github.com/pramsey/pointcloud.git
Mkdir pointcloud-build
cd pointcloud-build
cmake ../pointcloud -DPG_CONFIG=”/usr/pgsql-9.5/bin/pg_config
make 
make install


#...and finally PDAL!
git clone https://github.com/PDAL/PDAL.git
mkdir PDAL-build
cd PDAL-build
cmake3 ../PDAL
ccmake3 ../PDAL
#configure as required 
make
make install


# need to know where to look for PDAL...
export LD_LIBRARY_PATH="/usr/lib:/usr/local/lib"


#update jsoncpp from source:
Git clone https://github.com/open-source-parsers/jsoncpp.git
mkdir jsoncpp-build && cd jsoncpp-build
cmake3 -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=RelWithDebInfo ../jsoncpp
make && make install


#installs into /usr/lib - note this for entwine build




#then entwine
git clone https://github.com/connormanning/entwine.git
mkdir entwine-build && cd entwine-build
cmake3 -G "Unix Makefiles"     -DCMAKE_INSTALL_PREFIX=/usr     -DCMAKE_BUILD_TYPE=RelWithDebInfo ../entwine
#configure jsoncpp libraries here:
ccmake3 ../entwine
make && make install
cd ../


#finally the greyhound pointcloud server (used for querying the entwine index)
soon...
```
