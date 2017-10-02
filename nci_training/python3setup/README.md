# Setting up Python 3 using the VDI module system

If you need to set up Python without access to a customised Anaconda environment, the module system on the VDI will work for you.

This example shows how to set up **Python 3** on the VDI. 

**Note:** most Python applications will 'just work' in Python 3, but some are still dependent on Python 2. There is one small difference between Python 2 and 3 setup for virtual environments, we will get to that further down.

To see what Pythons are available, open a fresh terminal and type:

```
$ module avail python
-------------------------------------------------------- /apps/Modules/cloud/all ---------------------------------------------------------
python-dateutil/2.5.3-py2.7(py2.7) python-dateutil/2.5.3-py3.5(py3.5)

------------------------------------------------------- /apps/Modules/modulefiles --------------------------------------------------------
python/2.7.11(default)   python/2.7.3-matplotlib  python/2.7.6             python3/3.3.0-matplotlib python3/3.5.2(default)
python/2.7.11-matplotlib python/2.7.5             python/2.7.6-matplotlib  python3/3.4.3            python3/3.5.2-matplotlib
python/2.7.3             python/2.7.5-matplotlib  python3/3.3.0            python3/3.4.3-matplotlib
```

You can see that various versions are available. To use Python 3.5.2 type:

```
$ module load python3/3.5.2
```

...and then check what loaded with module list:

```
$ module list
```

Since most scientific applications of Python rely on matplotlib, it is generally useful to load that too - noting that a Python standard module must be loaded first:

```
$ module load python3/3.5.2-matplotlib
```

...and check again what is loaded using module list. A final really useful component is GDAL, which is best loaded using the VDI module system:

```
$ module load gdal-python/1.11.1-py3.5
```
## Customising Python on the VDI

If you need some Python component that is not present Python's standard library, it is good to use a virtual environment. For Python 2 on the VDI, a separate module must be loaded. For Python 3, an environment manager is loaded as part of the Python standard library and no further modules are required.

To create a virtual environment, the syntax is:

```
$ mkdir ~/venvs
$ cd ~/venvs
$ python3 -m venv vditest
[venvs]$ source vditest/bin/activate
(vditest) [venvs]$
```

Now you can safely use pip3 to install additional modules into this particular python instance:

```
(vditest) [venvs]$ pip3 install pandas
```

**Note:** keeping multiple virtual environments in your home directory on the VDI will rapidly consume your quota. If you have space on /g/data, keep your virtual environments there. You can monitor your local disk usage with the "quota" command.

To capture the configuration of a virtual environment and use it to create another:

```
(vditest) [venvs]$ pip3 freeze > ~/vditest_requirements.txt
```

To exit a virtual environment:

```
(vditest) [venvs]$ deactivate
```

To create a new virtual environment with the same configuration:

```
[venvs]$ pyvenv vditest_clone
[venvs]$ source vditest_clone/bin/activate
(vditest_clone) [venvs]$
[venvs]$ pip3 install -r ~/vditest_requirements.txt
```
For Python 2.x setup on the VDI, and more background on virtual environments, refer to the existing [Python in the VDI](https://github.com/nci/nci-notebooks/tree/master/Python_VDI) course material.
